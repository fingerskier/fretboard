import {INLAYS, pitchName, wrap12} from './theory'


const GAUGES = [3.4, 2.9, 2.4, 1.9, 1.4, 1] // low string first


// How wide each fret is relative to the first. Half the real taper keeps high frets legible.
export const fretGrowth = fret => Math.round(1000 * Math.pow(2, -(fret - 1) / 24)) / 10


// Everything the neck needs to draw: frets, strings and one cell per string × fret.
// Strings are numbered the guitarist's way: 1 is the highest, `tuning` is low to high.
export function buildNeck({key, chord, tuning, frets, label, showAll, pos, group, hidden = []}) {
  const chordRole = {}
  if (chord) chord.tones.forEach(t => { chordRole[t.pc] = t.role })

  const inPosition = fret => pos == null || (fret >= pos && fret <= pos + 3)
  const inGroup = stringNo => !group || (stringNo >= group && stringNo <= group + 2)

  const fretList = Array.from({length: frets + 1}, (_, fret) => ({
    fret,
    grow: fret === 0 ? 0 : fretGrowth(fret),
    inlay: INLAYS[fret] || 0,
  }))

  const strings = tuning.map((open, idx) => ({
    idx,
    stringNo: tuning.length - idx,
    open,
    name: key.nameOf(open),
    gauge: GAUGES[Math.round(idx * (GAUGES.length - 1) / Math.max(1, tuning.length - 1))],
    wound: idx < tuning.length - 2,
  }))

  const cells = []
  for (const string of strings) {
    for (const {fret} of fretList) {
      const midi = string.open + fret
      const pc = wrap12(midi)
      const scaleNote = key.byPc[pc]
      // a hidden degree stays hidden even as a chord tone or with every note shown
      if (scaleNote && hidden.includes(key.notes.indexOf(scaleNote))) continue

      const inScale = !!scaleNote
      const role = chordRole[pc]

      let kind
      if (chord) kind = role ? (role === 'R' ? 'chord-root' : 'chord') : inScale ? 'dim' : 'out'
      else kind = inScale ? (pc === key.rootPc ? 'root' : 'scale') : 'out'

      if (kind === 'out' && !showAll) continue

      cells.push({
        id: `${string.idx}-${fret}`,
        idx: string.idx,
        stringNo: string.stringNo,
        fret,
        midi,
        kind,
        role,
        faded: !(inPosition(fret) && inGroup(string.stringNo)),
        label: label === 'note' ? key.nameOf(pc)
          : label === 'interval' ? key.intervalOf(pc)
          : label === 'pitch' ? pitchName(key, midi)
          : label === 'midi' ? String(midi)
          : '',
      })
    }
  }

  return {frets: fretList, strings, cells}
}
