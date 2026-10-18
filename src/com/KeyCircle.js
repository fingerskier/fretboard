import {Fragment} from 'react'
import {useGuitar} from '../guitarContext'
import {circleIndexOf, circleOfFifths, scaleById} from '../lib/theory'
import cx from '../lib/cx'

const CIRCLE = circleOfFifths()
const OUTER_RADIUS = 40 // % of the circle's width
const INNER_RADIUS = 25.5


const place = (index, radius) => {
  const angle = index * Math.PI / 6

  return {
    left: `${50 + radius * Math.sin(angle)}%`,
    top: `${50 - radius * Math.cos(angle)}%`,
  }
}


// Outer ring picks a major key, inner ring its relative minor.
// A ring keeps the current mode when it matches (D dorian -> E dorian), otherwise switches to plain major or minor.
export default function KeyCircle() {
  const {state, update, key} = useGuitar()
  const family = scaleById(state.scaleId).family
  const at = circleIndexOf(state.rootPc, state.scaleId)

  const pick = (rootPc, ring) => update(s => scaleById(s.scaleId).family === ring
    ? {rootPc}
    : {rootPc, scaleId: ring, hidden: [], chord: -1}
  )

  return <div className="key-circle" role="group" aria-label="Key, by circle of fifths">
    <div className="key-circle__ring key-circle__ring--outer" aria-hidden="true" />
    <div className="key-circle__ring key-circle__ring--inner" aria-hidden="true" />

    <div className="key-circle__center" aria-hidden="true">
      <span className="key-circle__root">{key.rootName}</span>
      <span className="key-circle__mode">{key.scale.label}</span>
      <span className="key-circle__sig">{key.signature}</span>
    </div>

    {CIRCLE.map(c => {
      const selected = c.index === at
      const near = c.index === (at + 1) % 12 || c.index === (at + 11) % 12
      const majorOn = selected && family === 'major' && state.rootPc === c.majorPc
      const minorOn = selected && family === 'minor' && state.rootPc === c.minorPc

      return <Fragment key={c.index}>
        <button
          type="button"
          className={cx('key-circle__key', 'key-circle__key--major', {on: majorOn, selected, near})}
          style={place(c.index, OUTER_RADIUS)}
          aria-pressed={majorOn}
          aria-label={`${c.majorName} major, ${c.signature}`}
          onClick={() => pick(c.majorPc, 'major')}
        >
          <span className="key-circle__name">{c.majorName}</span>
          {c.index ? <span className="key-circle__count">{c.signature}</span> : null}
        </button>

        <button
          type="button"
          className={cx('key-circle__key', 'key-circle__key--minor', {on: minorOn, selected, near})}
          style={place(c.index, INNER_RADIUS)}
          aria-pressed={minorOn}
          aria-label={`${c.minorName} minor, ${c.signature}`}
          onClick={() => pick(c.minorPc, 'minor')}
        >
          {c.minorName}m
        </button>
      </Fragment>
    })}
  </div>
}
