import {buildNeck} from './neck'
import {TUNINGS, diatonicChords, spellKey} from './theory'


const STANDARD = TUNINGS[0].midi
const G_MAJOR = spellKey(7, 'major')

const neck = overrides => buildNeck({
  key: G_MAJOR,
  chord: null,
  tuning: STANDARD,
  frets: 12,
  label: 'note',
  showAll: false,
  pos: null,
  group: 0,
  ...overrides,
})

const cellAt = (result, stringNo, fret) => result.cells.find(c => c.stringNo === stringNo && c.fret === fret)


test('strings are numbered from the high e and named by the key', () => {
  const {strings, frets} = neck()

  expect(strings.map(s => `${s.stringNo}${s.name}`).join(' ')).toBe('6E 5A 4D 3G 2B 1E')
  expect(frets).toHaveLength(13)
  expect(frets[12].inlay).toBe(2)
})


test('only key tones are shown unless asked', () => {
  expect(cellAt(neck(), 6, 3).kind).toBe('root') // G on the low E
  expect(cellAt(neck(), 6, 2).kind).toBe('scale') // F♯
  expect(cellAt(neck(), 6, 1)).toBeUndefined() // F is outside G major
  expect(cellAt(neck({showAll: true}), 6, 1).kind).toBe('out')
})


test('a chord takes over: chord tones lead, other key tones dim', () => {
  const D = diatonicChords(G_MAJOR)[4]
  const result = neck({chord: D})

  expect(cellAt(result, 4, 0).kind).toBe('chord-root') // open D
  expect(cellAt(result, 2, 7).role).toBe('3') // F♯ on the B string
  expect(cellAt(result, 6, 3).kind).toBe('dim') // G is in the key, not the chord
})


test('position and string group fade what they leave out', () => {
  const result = neck({pos: 2, group: 1})

  expect(cellAt(result, 1, 3).faded).toBe(false)
  expect(cellAt(result, 1, 7).faded).toBe(true)
  expect(cellAt(result, 4, 4).faded).toBe(true)
})


test('hidden degrees drop out and labels follow the chosen mode', () => {
  const hideRoot = neck({hidden: [0]})
  expect(cellAt(hideRoot, 6, 3)).toBeUndefined()

  expect(cellAt(neck({label: 'interval'}), 6, 2).label).toBe('7')
  expect(cellAt(neck({label: 'pitch'}), 1, 3).label).toBe('G4')
  expect(cellAt(neck({label: 'midi'}), 6, 3).label).toBe('43')
  expect(cellAt(neck({label: 'none'}), 6, 3).label).toBe('')
})
