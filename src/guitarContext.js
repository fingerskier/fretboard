import {createContext, useCallback, useContext, useEffect, useMemo, useReducer} from 'react'
import {SCALES, TUNINGS, diatonicChords, parseLegacyNote, scaleById, spellKey} from './lib/theory'

const GuitarContext = createContext()

const STORAGE_KEY = 'fretboard:settings:v2'
const LEGACY_TUNING_KEY = 'guitarTuning'
export const FRET_CHOICES = [12, 15, 19, 22, 24]

export const DEFAULTS = {
  rootPc: 7, // G
  scaleId: 'major',
  tuning: TUNINGS[0].midi,
  label: 'note',
  showAll: false,
  chord: -1,
  sevenths: false,
  pos: null,
  group: 0,
  hidden: [],
  frets: 15,
}


const isPitch = n => Number.isInteger(n) && n >= 0 && n <= 120


// Keep only well-formed saved values so a bad localStorage entry can't break the app.
function sanitize(saved) {
  const s = {...DEFAULTS}
  if (!saved || typeof saved !== 'object') return s

  if (Number.isInteger(saved.rootPc) && saved.rootPc >= 0 && saved.rootPc < 12) s.rootPc = saved.rootPc
  if (SCALES.some(x => x.id === saved.scaleId)) s.scaleId = saved.scaleId
  if (Array.isArray(saved.tuning) && saved.tuning.length === 6 && saved.tuning.every(isPitch)) s.tuning = saved.tuning
  if (['note', 'interval', 'pitch', 'midi', 'none'].includes(saved.label)) s.label = saved.label
  if (typeof saved.showAll === 'boolean') s.showAll = saved.showAll
  if (Number.isInteger(saved.chord) && saved.chord >= -1 && saved.chord < 7) s.chord = saved.chord
  if (typeof saved.sevenths === 'boolean') s.sevenths = saved.sevenths
  if (saved.pos === null || (Number.isInteger(saved.pos) && saved.pos >= 0)) s.pos = saved.pos
  if (Number.isInteger(saved.group) && saved.group >= 0 && saved.group <= 4) s.group = saved.group
  if (Array.isArray(saved.hidden) && saved.hidden.every(Number.isInteger)) s.hidden = saved.hidden
  if (FRET_CHOICES.includes(saved.frets)) s.frets = saved.frets
  if (s.pos != null) s.pos = Math.min(s.pos, s.frets - 3)

  return s
}


// The first version saved only the tuning, as ['e2', 'a2', ...]; its default had the high string an octave low.
function legacyTuning(raw) {
  try {
    const notes = JSON.parse(raw)
    if (!Array.isArray(notes) || notes.length !== 6) return null
    if (notes.join() === 'e2,a2,d3,g3,b3,e3') return TUNINGS[0].midi

    const midi = notes.map(parseLegacyNote)
    return midi.every(isPitch) ? midi : null
  } catch {
    return null
  }
}


function load() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return sanitize(JSON.parse(saved))

    const legacy = localStorage.getItem(LEGACY_TUNING_KEY)
    const tuning = legacy && legacyTuning(legacy)
    return tuning ? {...DEFAULTS, tuning} : {...DEFAULTS}
  } catch {
    return {...DEFAULTS}
  }
}


// Updates are patches merged into the latest state, or functions of it, so controls never clobber each other.
function reducer(state, update) {
  const patch = typeof update === 'function' ? update(state) : update

  return patch ? {...state, ...patch} : state
}


export function GuitarProvider({children}) {
  const [state, update] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // storage can be full or blocked; the app still works without it
    }
  }, [state])

  const theory = useMemo(() => {
    const key = spellKey(state.rootPc, state.scaleId)
    const chordScale = scaleById(state.scaleId).chordScale
    const chordKey = chordScale ? spellKey(state.rootPc, chordScale) : key
    const chords = diatonicChords(chordKey, state.sevenths)
    const chord = chords[state.chord] || null

    return {key, chordKey, chords, chord}
  }, [state.rootPc, state.scaleId, state.sevenths, state.chord])

  // Changing scale renumbers its degrees, so per-degree settings start over.
  const setScale = useCallback(scaleId => update({scaleId, hidden: [], chord: -1}), [])

  const value = useMemo(() => ({state, update, setScale, ...theory}), [state, setScale, theory])

  return <GuitarContext.Provider value={value}>
    {children}
  </GuitarContext.Provider>
}


export function useGuitar() {
  return useContext(GuitarContext)
}

export default GuitarContext
