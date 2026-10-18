import {useGuitar, FRET_CHOICES} from '../guitarContext'
import cx from '../lib/cx'

const LABELS = [
  ['note', 'Note'],
  ['interval', 'Interval'],
  ['pitch', 'Pitch'],
  ['midi', 'MIDI'],
  ['none', 'Dots'],
]


export function Chevron({direction}) {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d={direction === 'left' ? 'M15 18l-6-6 6-6' : direction === 'right' ? 'M9 18l6-6-6-6' : 'M6 9l6 6 6-6'} />
  </svg>
}


function Segmented({label, options, value, onChange}) {
  return <div className="segmented" role="group" aria-label={label}>
    {options.map(([id, text]) => <button
      type="button"
      key={id}
      className={cx('segmented__option', {on: value === id})}
      aria-pressed={value === id}
      onClick={() => onChange(id)}
    >
      {text}
    </button>)}
  </div>
}


export function LabelPicker() {
  const {state, update} = useGuitar()

  return <Segmented label="Note labels" options={LABELS} value={state.label} onChange={label => update({label})} />
}


export function SeventhsToggle() {
  const {state, update} = useGuitar()

  return <Segmented
    label="Chord size"
    options={[['triads', 'Triads'], ['sevenths', 'Sevenths']]}
    value={state.sevenths ? 'sevenths' : 'triads'}
    onChange={id => update({sevenths: id === 'sevenths'})}
  />
}


// Pentatonic and blues keys borrow chords from their parent major or minor; say so.
export function ChordSource() {
  const {key, chordKey} = useGuitar()
  if (chordKey === key) return null

  return <p className="hint">Chords from {chordKey.title}</p>
}


export function ChordSelect() {
  const {state, update, chords} = useGuitar()

  return <label className="field">
    <span className="field__label">Chord</span>
    <select value={chords[state.chord] ? state.chord : -1} onChange={e => update({chord: Number(e.target.value)})}>
      <option value={-1}>None (whole scale)</option>
      {chords.map(c => <option key={c.index} value={c.index}>
        {c.numeral} · {c.name} ({c.tones.map(t => t.name).join(' ')})
      </option>)}
    </select>
  </label>
}


export function ChordGrid() {
  const {state, update, chords} = useGuitar()
  const current = chords[state.chord] ? state.chord : -1

  const items = [{index: -1, numeral: 'None', name: 'whole scale'}, ...chords]

  return <div className="chord-grid" role="group" aria-label="Chords in this key">
    {items.map(c => <button
      type="button"
      key={c.index}
      className={cx('chord-grid__chord', {on: current === c.index})}
      aria-pressed={current === c.index}
      onClick={() => update({chord: c.index})}
    >
      <span className="chord-grid__numeral">{c.numeral}</span>
      <span className="chord-grid__name">{c.name}</span>
    </button>)}
  </div>
}


export function PositionStepper() {
  const {state, update} = useGuitar()
  const {pos} = state

  const label = pos == null ? 'All frets' : pos === 0 ? 'Open to fret 3' : `Frets ${pos}–${pos + 3}`

  return <div className="stepper" role="group" aria-label="Hand position">
    <button
      type="button"
      className="icon-button"
      aria-label="Move the position toward the nut"
      onClick={() => update(s => ({pos: s.pos == null ? 0 : Math.max(0, s.pos - 1)}))}
    >
      <Chevron direction="left" />
    </button>

    <span className="stepper__value" aria-live="polite">{label}</span>

    <button
      type="button"
      className="icon-button"
      aria-label="Move the position toward the body"
      onClick={() => update(s => ({pos: s.pos == null ? 0 : Math.min(s.frets - 3, s.pos + 1)}))}
    >
      <Chevron direction="right" />
    </button>

    <button type="button" className="button" disabled={pos == null} onClick={() => update({pos: null})}>All</button>
  </div>
}


export function StringGroupSelect() {
  const {state, update} = useGuitar()

  return <label className="field">
    <span className="field__label">Strings</span>
    <select value={state.group} onChange={e => update({group: Number(e.target.value)})}>
      <option value={0}>All six</option>
      <option value={1}>1–3 (treble)</option>
      <option value={2}>2–4</option>
      <option value={3}>3–5</option>
      <option value={4}>4–6 (bass)</option>
    </select>
  </label>
}


export function FretSelect() {
  const {state, update} = useGuitar()

  const change = frets => update(s => ({frets, pos: s.pos == null ? null : Math.min(s.pos, frets - 3)}))

  return <label className="field">
    <span className="field__label">Frets</span>
    <select value={state.frets} onChange={e => change(Number(e.target.value))}>
      {FRET_CHOICES.map(n => <option key={n} value={n}>{n}</option>)}
    </select>
  </label>
}


export function ShowAllToggle() {
  const {state, update} = useGuitar()

  return <label className="check">
    <input type="checkbox" checked={state.showAll} onChange={e => update({showAll: e.target.checked})} />
    Show notes outside the key
  </label>
}
