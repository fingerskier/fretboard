// Music theory for the fretboard: key-aware spelling, intervals and diatonic chords.
// Pitch classes are 0-11 with C = 0; pitches are MIDI numbers (E2 = 40).

export const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const LETTER_PC = [0, 2, 4, 5, 7, 9, 11]
const MAJOR = [0, 2, 4, 5, 7, 9, 11]
const PREFERRED_ROOT = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B']
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']

export const SHARP_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']
export const FLAT_NAMES = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B']
export const SEMI_NAMES = ['1', '♭2', '2', '♭3', '3', '4', '♭5', '5', '♭6', '6', '♭7', '7']

// parentOffset: semitones from the parent major's tonic up to this scale's tonic.
// chordScale: pentatonic and blues scales borrow their chords from this scale.
export const SCALES = [
  {id: 'major', label: 'Major', group: 'Diatonic modes', family: 'major', parentOffset: 0, semis: [0, 2, 4, 5, 7, 9, 11]},
  {id: 'dorian', label: 'Dorian', group: 'Diatonic modes', family: 'minor', parentOffset: 2, semis: [0, 2, 3, 5, 7, 9, 10]},
  {id: 'phrygian', label: 'Phrygian', group: 'Diatonic modes', family: 'minor', parentOffset: 4, semis: [0, 1, 3, 5, 7, 8, 10]},
  {id: 'lydian', label: 'Lydian', group: 'Diatonic modes', family: 'major', parentOffset: 5, semis: [0, 2, 4, 6, 7, 9, 11]},
  {id: 'mixolydian', label: 'Mixolydian', group: 'Diatonic modes', family: 'major', parentOffset: 7, semis: [0, 2, 4, 5, 7, 9, 10]},
  {id: 'minor', label: 'Natural minor', group: 'Diatonic modes', family: 'minor', parentOffset: 9, semis: [0, 2, 3, 5, 7, 8, 10]},
  {id: 'locrian', label: 'Locrian', group: 'Diatonic modes', family: 'minor', parentOffset: 11, semis: [0, 1, 3, 5, 6, 8, 10]},
  {id: 'harmonicMinor', label: 'Harmonic minor', group: 'Minor family', family: 'minor', parentOffset: 9, semis: [0, 2, 3, 5, 7, 8, 11]},
  {id: 'melodicMinor', label: 'Melodic minor', group: 'Minor family', family: 'minor', parentOffset: 9, semis: [0, 2, 3, 5, 7, 9, 11]},
  {id: 'majorPent', label: 'Major pentatonic', group: 'Pentatonic and blues', family: 'major', parentOffset: 0, chordScale: 'major', semis: [0, 2, 4, 7, 9], degs: [1, 2, 3, 5, 6]},
  {id: 'minorPent', label: 'Minor pentatonic', group: 'Pentatonic and blues', family: 'minor', parentOffset: 9, chordScale: 'minor', semis: [0, 3, 5, 7, 10], degs: [1, 3, 4, 5, 7]},
  {id: 'blues', label: 'Blues', group: 'Pentatonic and blues', family: 'minor', parentOffset: 9, chordScale: 'minor', semis: [0, 3, 5, 6, 7, 10], degs: [1, 3, 4, 5, 5, 7]},
]

export const TUNINGS = [
  {id: 'standard', label: 'Standard', midi: [40, 45, 50, 55, 59, 64]},
  {id: 'dropD', label: 'Drop D', midi: [38, 45, 50, 55, 59, 64]},
  {id: 'dadgad', label: 'DADGAD', midi: [38, 45, 50, 55, 57, 62]},
  {id: 'openG', label: 'Open G', midi: [38, 43, 50, 55, 59, 62]},
  {id: 'fourths', label: 'All fourths', midi: [40, 45, 50, 55, 60, 65]},
  {id: 'halfDown', label: 'Half-step down', midi: [39, 44, 49, 54, 58, 63]},
]

export const INLAYS = {3: 1, 5: 1, 7: 1, 9: 1, 12: 2, 15: 1, 17: 1, 19: 1, 21: 1, 24: 2}


export const wrap12 = n => ((n % 12) + 12) % 12

const signedDiff = (a, b) => {
  const d = wrap12(a - b)
  return d > 6 ? d - 12 : d
}

const accText = n => n === 0 ? '' : n > 0 ? '♯'.repeat(n) : '♭'.repeat(-n)

export const scaleById = id => SCALES.find(s => s.id === id) || SCALES[0]


const spellFrom = (rootPc, rootLetter, scale) => scale.semis.map((semi, i) => {
  const deg = scale.degs ? scale.degs[i] : i + 1
  const letter = (rootLetter + deg - 1) % 7
  const pc = wrap12(rootPc + semi)
  const acc = signedDiff(pc, LETTER_PC[letter])

  return {
    pc, semi, deg, acc,
    name: LETTERS[letter] + accText(acc),
    interval: accText(semi - MAJOR[deg - 1]) + deg,
  }
})


// Spell a key, choosing the root letter that gives the fewest accidentals.
// Ties (six sharps vs six flats) follow the parent major, so modes and the
// circle of fifths agree: D♯ minor sits under F♯ major.
export const spellKey = (rootPc, scaleId) => {
  const scale = scaleById(scaleId)
  const preferredName = scale.parentOffset
    ? spellKey(wrap12(rootPc - scale.parentOffset), 'major').nameOf(rootPc)
    : PREFERRED_ROOT[rootPc]

  let best = null
  for (let letter = 0; letter < 7; letter++) {
    const acc = signedDiff(rootPc, LETTER_PC[letter])
    if (Math.abs(acc) > 1) continue

    const notes = spellFrom(rootPc, letter, scale)
    const cost = notes.reduce((sum, n) => sum + Math.abs(n.acc) + (Math.abs(n.acc) > 1 ? 10 : 0), 0)
    const preferred = notes[0].name === preferredName
    if (!best || cost < best.cost || (cost === best.cost && preferred)) best = {cost, notes}
  }

  const {notes} = best
  const flats = notes.some(n => n.acc < 0)
  const byPc = {}
  notes.forEach(n => { if (!byPc[n.pc]) byPc[n.pc] = n })

  // The signature belongs to the parent major: D harmonic minor is 1♭ despite its C♯.
  let signature
  if (scale.id === 'major') {
    const sharps = notes.filter(n => n.acc > 0).length
    const flatCount = notes.filter(n => n.acc < 0).length
    signature = sharps ? `${sharps}♯` : flatCount ? `${flatCount}♭` : 'no ♯/♭'
  } else {
    signature = spellKey(wrap12(rootPc - scale.parentOffset), 'major').signature
  }

  return {
    rootPc, scale, notes, byPc, signature,
    rootName: notes[0].name,
    title: `${notes[0].name} ${scale.label.toLowerCase()}`,
    nameOf: pc => byPc[wrap12(pc)]?.name ?? (flats ? FLAT_NAMES : SHARP_NAMES)[wrap12(pc)],
    intervalOf: pc => byPc[wrap12(pc)]?.interval ?? SEMI_NAMES[wrap12(pc - rootPc)],
  }
}


// Name with octave, following the letter: C♭4 is MIDI 59 and B♯3 is MIDI 60.
export const pitchName = (key, midi) => {
  const n = key.byPc[wrap12(midi)]
  const acc = n ? n.acc : 0

  return key.nameOf(midi) + (Math.floor((midi - acc) / 12) - 1)
}


const chordQuality = ints => {
  const has = x => ints.includes(x)
  const triad = has(4) && has(7) ? 'maj'
    : has(3) && has(7) ? 'min'
    : has(3) && has(6) ? 'dim'
    : has(4) && has(8) ? 'aug'
    : 'other'
  let symbol = {maj: '', min: 'm', dim: '°', aug: '+', other: '?'}[triad]

  if (ints.length > 3) {
    const sevenths = {maj11: 'maj7', maj10: '7', min10: 'm7', min11: 'm(maj7)', dim10: 'm7♭5', dim9: '°7', aug11: '+maj7', aug10: '+7'}
    symbol = sevenths[triad + ints[3]] || symbol
  }

  return {triad, symbol}
}


// Tone k of a stacked-thirds chord is its 1st, 3rd, 5th or 7th; name it by that degree,
// so the top of a diminished seventh is ♭♭7 rather than the enharmonic 6.
const chordRole = (k, semi) => k === 0 ? 'R' : accText(semi - MAJOR[2 * k]) + (2 * k + 1)


// The chords built on each degree of a 7-note scale; [] for anything else.
export const diatonicChords = (key, sevenths = false) => {
  const {notes} = key
  if (notes.length !== 7) return []

  return notes.map((n, i) => {
    const tones = (sevenths ? [0, 2, 4, 6] : [0, 2, 4]).map(k => notes[(i + k) % 7])
    const ints = tones.map(t => wrap12(t.pc - n.pc))
    const {triad, symbol} = chordQuality(ints)
    const accidental = n.interval.replace(/[0-9]/g, '')
    const numeral = triad === 'min' || triad === 'dim' ? ROMAN[i].toLowerCase() : ROMAN[i]
    const suffix = triad === 'dim' ? (sevenths && ints[3] === 10 ? 'ø7' : sevenths ? '°7' : '°')
      : triad === 'aug' ? (sevenths ? (ints[3] === 11 ? '+maj7' : '+7') : '+')
      : sevenths ? (ints[3] === 11 ? 'maj7' : '7')
      : ''

    return {
      index: i,
      rootPc: n.pc,
      numeral: accidental + numeral + suffix,
      name: n.name + symbol,
      quality: triad,
      tones: tones.map((t, k) => ({pc: t.pc, name: t.name, role: chordRole(k, ints[k])})),
    }
  })
}


// Twelve circle-of-fifths positions, C at the top and sharps clockwise.
export const circleOfFifths = () => Array.from({length: 12}, (_, index) => {
  const majorPc = (index * 7) % 12
  const minorPc = wrap12(majorPc + 9)
  const major = spellKey(majorPc, 'major')

  return {
    index,
    majorPc,
    minorPc,
    majorName: major.rootName,
    minorName: spellKey(minorPc, 'minor').rootName,
    signature: major.signature,
  }
})


// Where a key sits on the circle: the position of its parent major.
export const circleIndexOf = (rootPc, scaleId) => {
  const parentPc = wrap12(rootPc - scaleById(scaleId).parentOffset)

  return (parentPc * 7) % 12
}


// The pre-2.0 app stored notes as letter + octave, with uppercase meaning sharp ('C4' = C♯4).
const LEGACY_PC = {c: 0, C: 1, d: 2, D: 3, e: 4, f: 5, F: 6, g: 7, G: 8, a: 9, A: 10, b: 11}

export const parseLegacyNote = note => {
  if (typeof note !== 'string' || !(note[0] in LEGACY_PC)) return null

  const octave = parseInt(note.slice(1), 10)
  if (Number.isNaN(octave)) return null

  return LEGACY_PC[note[0]] + 12 * (octave + 1)
}
