import {useGuitar} from '../guitarContext'


export default function Legend() {
  const {state, chord} = useGuitar()

  const items = chord
    ? [['chord-root', 'Chord root'], ['chord', 'Chord tone'], ['dim', 'Other note in key']]
    : [['root', 'Key root'], ['scale', 'Note in key']]
  if (state.showAll) items.push(['out', 'Outside the key'])
  if (state.pos != null || state.group) items.push(['faded', 'Faded: outside position or strings'])

  return <div className="legend">
    {items.map(([kind, text]) => <span key={kind} className="legend__item">
      <span className={`legend__swatch dot--${kind === 'faded' ? 'scale dot--faded' : kind}`} aria-hidden="true" />
      {text}
    </span>)}

    {chord ? <span className="legend__chord">
      {chord.numeral} {chord.name}: {chord.tones.map(t => `${t.name} ${t.role}`).join(' · ')}
    </span> : null}
  </div>
}
