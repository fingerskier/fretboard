import {useGuitar} from '../guitarContext'
import {TUNINGS, wrap12} from '../lib/theory'
import cx from '../lib/cx'

const OCTAVES = [1, 2, 3, 4, 5]


export function usePreset() {
  const {state, key} = useGuitar()
  const preset = TUNINGS.find(t => t.midi.join() === state.tuning.join())

  return {preset, names: state.tuning.map(m => key.nameOf(m)).join(' ')}
}


export function TuningSelect() {
  const {update} = useGuitar()
  const {preset} = usePreset()

  const choose = id => {
    const tuning = TUNINGS.find(t => t.id === id)
    if (tuning) update({tuning: tuning.midi})
  }

  return <label className="field">
    <span className="field__label">Tuning</span>
    <select value={preset ? preset.id : 'custom'} onChange={e => choose(e.target.value)}>
      {TUNINGS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
      {preset ? null : <option value="custom">Custom</option>}
    </select>
  </label>
}


export function TuningList() {
  const {update, key} = useGuitar()
  const {preset} = usePreset()

  return <div className="tuning-list" role="group" aria-label="Tuning presets">
    {TUNINGS.map(t => <button
      type="button"
      key={t.id}
      className={cx('tuning-list__item', {on: preset === t})}
      aria-pressed={preset === t}
      onClick={() => update({tuning: t.midi})}
    >
      <span>{t.label}</span>
      <span className="tuning-list__notes">{t.midi.map(m => key.nameOf(m)).join(' ')}</span>
    </button>)}
  </div>
}


// Pitch and octave per string, low string first.
export function TuningEditor() {
  const {state, update, key} = useGuitar()
  const count = state.tuning.length

  const set = (idx, pc, octave) => update(s => {
    const tuning = [...s.tuning]
    tuning[idx] = pc + 12 * (octave + 1)
    return {tuning}
  })

  return <div className="tuning-editor">
    {state.tuning.map((midi, idx) => {
      const pc = wrap12(midi)
      const octave = Math.floor(midi / 12) - 1
      const stringNo = count - idx
      const label = `String ${stringNo}${idx === 0 ? ' (low)' : idx === count - 1 ? ' (high)' : ''}`

      return <div className="tuning-editor__row" key={idx}>
        <span className="tuning-editor__label">{label}</span>
        <select aria-label={`${label} note`} value={pc} onChange={e => set(idx, Number(e.target.value), octave)}>
          {Array.from({length: 12}, (_, p) => <option key={p} value={p}>{key.nameOf(p)}</option>)}
        </select>
        <select aria-label={`${label} octave`} value={octave} onChange={e => set(idx, pc, Number(e.target.value))}>
          {OCTAVES.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    })}
  </div>
}
