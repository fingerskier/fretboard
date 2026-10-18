import {useGuitar} from '../guitarContext'
import {SCALES} from '../lib/theory'
import cx from '../lib/cx'

const GROUPS = [...new Set(SCALES.map(s => s.group))]


export function ModeSelect() {
  const {state, setScale} = useGuitar()

  return <label className="field">
    <span className="field__label">Mode</span>
    <select value={state.scaleId} onChange={e => setScale(e.target.value)}>
      {GROUPS.map(group => <optgroup key={group} label={group}>
        {SCALES.filter(s => s.group === group).map(s => <option key={s.id} value={s.id}>
          {s.id === 'major' ? 'Major (Ionian)' : s.id === 'minor' ? 'Natural minor (Aeolian)' : s.label}
        </option>)}
      </optgroup>)}
    </select>
  </label>
}


// One button per scale note; pressing one hides that note on the neck.
export function Degrees({className}) {
  const {state, update, key} = useGuitar()

  const toggle = i => update(s => ({
    hidden: s.hidden.includes(i) ? s.hidden.filter(x => x !== i) : [...s.hidden, i],
  }))

  return <div className={cx('degrees', className)} role="group" aria-label="Scale notes. Press one to hide it on the neck">
    {key.notes.map((n, i) => {
      const on = !state.hidden.includes(i)

      return <button
        type="button"
        key={i}
        className={cx('degree', {'degree--root': i === 0, 'degree--off': !on})}
        aria-pressed={on}
        onClick={() => toggle(i)}
      >
        <span className="degree__name">{n.name}</span>
        <span className="degree__interval">{n.interval}</span>
      </button>
    })}
  </div>
}


export default function KeyDetails() {
  const {key} = useGuitar()

  return <div className="key-details">
    <div className="key-details__title">
      <h2>{key.title}</h2>
      <span className="pill">{key.signature}</span>
    </div>

    <ModeSelect />

    <Degrees />
  </div>
}
