import {
  SCALES,
  circleIndexOf,
  circleOfFifths,
  diatonicChords,
  parseLegacyNote,
  pitchName,
  spellKey,
} from './theory'


const spelled = (pc, scaleId) => spellKey(pc, scaleId).notes.map(n => n.name).join(' ')


test.each([
  [0, 'major', 'C D E F G A B'],
  [5, 'major', 'F G A B♭ C D E'],
  [10, 'major', 'B♭ C D E♭ F G A'],
  [8, 'major', 'A♭ B♭ C D♭ E♭ F G'],
  [1, 'major', 'D♭ E♭ F G♭ A♭ B♭ C'],
  [11, 'major', 'B C♯ D♯ E F♯ G♯ A♯'],
  [6, 'major', 'F♯ G♯ A♯ B C♯ D♯ E♯'],
  [3, 'minor', 'D♯ E♯ F♯ G♯ A♯ B C♯'],
  [8, 'minor', 'G♯ A♯ B C♯ D♯ E F♯'],
  [1, 'minor', 'C♯ D♯ E F♯ G♯ A B'],
  [2, 'dorian', 'D E F G A B C'],
  [11, 'locrian', 'B C D E F G A'],
  [9, 'harmonicMinor', 'A B C D E F G♯'],
  [9, 'blues', 'A C D E♭ E G'],
  [4, 'minorPent', 'E G A B D'],
])('spells %i %s as %s', (pc, scaleId, expected) => {
  expect(spelled(pc, scaleId)).toBe(expected)
})


test('no key or scale needs a double sharp or flat', () => {
  for (const scale of SCALES) {
    for (let pc = 0; pc < 12; pc++) {
      const doubles = spellKey(pc, scale.id).notes.filter(n => Math.abs(n.acc) > 1)
      expect(doubles).toEqual([])
    }
  }
})


test('intervals are named against the major scale', () => {
  const intervals = (pc, id) => spellKey(pc, id).notes.map(n => n.interval).join(' ')

  expect(intervals(0, 'minor')).toBe('1 2 ♭3 4 5 ♭6 ♭7')
  expect(intervals(5, 'lydian')).toBe('1 2 3 ♯4 5 6 7')
  expect(intervals(9, 'blues')).toBe('1 ♭3 4 ♭5 5 ♭7')
})


test('key signatures come from the parent major', () => {
  expect(spellKey(2, 'harmonicMinor').signature).toBe('1♭')
  expect(spellKey(7, 'majorPent').signature).toBe('1♯')
  expect(spellKey(9, 'blues').signature).toBe('no ♯/♭')
  expect(spellKey(3, 'minor').signature).toBe('6♯')
  expect(spellKey(5, 'major').signature).toBe('1♭')
})


test('notes outside the key follow its accidentals', () => {
  expect(spellKey(0, 'major').nameOf(1)).toBe('C♯')
  expect(spellKey(5, 'major').nameOf(1)).toBe('D♭')
  expect(spellKey(0, 'major').intervalOf(6)).toBe('♭5')
})


test('pitch names carry the octave of the letter', () => {
  const C = spellKey(0, 'major')

  expect(pitchName(C, 40)).toBe('E2')
  expect(pitchName(C, 64)).toBe('E4')
  expect(pitchName(spellKey(6, 'major'), 65)).toBe('E♯4')
  expect(pitchName(spellKey(6, 'minor'), 59)).toBe('B3')
  expect(pitchName(spellKey(1, 'harmonicMinor'), 60)).toBe('B♯3')
})


test('diatonic triads and sevenths', () => {
  const describe = chords => chords.map(c => `${c.numeral}:${c.name}`).join(' ')
  const C = spellKey(0, 'major')

  expect(describe(diatonicChords(C))).toBe('I:C ii:Dm iii:Em IV:F V:G vi:Am vii°:B°')
  expect(describe(diatonicChords(C, true))).toBe('Imaj7:Cmaj7 ii7:Dm7 iii7:Em7 IVmaj7:Fmaj7 V7:G7 vi7:Am7 viiø7:Bm7♭5')
  expect(describe(diatonicChords(spellKey(9, 'minor')))).toBe('i:Am ii°:B° ♭III:C iv:Dm v:Em ♭VI:F ♭VII:G')

  const harmonic = diatonicChords(spellKey(9, 'harmonicMinor'), true)
  expect(harmonic[0].name).toBe('Am(maj7)')
  expect(harmonic[6].numeral).toBe('vii°7')
  expect(harmonic[6].name).toBe('G♯°7')

  expect(diatonicChords(C, true)[4].tones.map(t => t.name + t.role)).toEqual(['GR', 'B3', 'D5', 'F♭7'])
  expect(harmonic[2].numeral).toBe('♭III+maj7')
  expect(harmonic[6].tones.map(t => t.name + ' ' + t.role)).toEqual(['G♯ R', 'B ♭3', 'D ♭5', 'F ♭♭7'])
  expect(diatonicChords(spellKey(4, 'minorPent'))).toEqual([])
})


test('circle of fifths runs clockwise in sharps and agrees with spelling', () => {
  const circle = circleOfFifths()

  expect(circle.map(c => c.majorName).join(' ')).toBe('C G D A E B F♯ D♭ A♭ E♭ B♭ F')
  expect(circle.map(c => c.minorName).join(' ')).toBe('A E B F♯ C♯ G♯ D♯ B♭ F C G D')
  expect(circle[6].signature).toBe('6♯')
  expect(circle[11].signature).toBe('1♭')
})


test('modes sit at their parent major on the circle', () => {
  expect(circleIndexOf(7, 'major')).toBe(1) // G
  expect(circleIndexOf(4, 'minor')).toBe(1) // E minor shares G's signature
  expect(circleIndexOf(2, 'dorian')).toBe(0) // D dorian is all white keys
  expect(circleIndexOf(5, 'lydian')).toBe(0)
  expect(circleIndexOf(9, 'minorPent')).toBe(0)
})


test('legacy note strings use uppercase for sharps', () => {
  expect(parseLegacyNote('e2')).toBe(40)
  expect(parseLegacyNote('C4')).toBe(61)
  expect(parseLegacyNote('x2')).toBe(null)
  expect(parseLegacyNote('e')).toBe(null)
})
