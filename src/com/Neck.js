import {useMemo} from 'react'
import {useGuitar} from '../guitarContext'
import {buildNeck} from '../lib/neck'
import cx from '../lib/cx'


// One CSS grid holds the board, fret wires, strings, labels and dots.
// Horizontal: high string on top, nut on the left. Vertical (phones): nut on top, low string on the left.
export default function Neck({vertical = false}) {
  const {state, key, chord} = useGuitar()
  const {tuning, frets: fretCount, label, showAll, pos, group, hidden} = state

  const {frets, strings, cells} = useMemo(
    () => buildNeck({key, chord, tuning, frets: fretCount, label, showAll, pos, group, hidden}),
    [key, chord, tuning, fretCount, label, showAll, pos, group, hidden]
  )

  const n = strings.length
  const lastFret = frets.length + 1 // grid line after the last fret column/row

  const cell = (idx, fret) => vertical
    ? {gridRow: fret + 2, gridColumn: idx + 2}
    : {gridRow: n - idx, gridColumn: fret + 2}
  const fretSpan = fret => vertical
    ? {gridRow: fret + 2, gridColumn: `2 / ${n + 2}`}
    : {gridRow: `1 / ${n + 1}`, gridColumn: fret + 2}
  const stringSpan = idx => vertical
    ? {gridRow: `2 / ${lastFret + 1}`, gridColumn: idx + 2}
    : {gridRow: n - idx, gridColumn: `2 / ${lastFret + 1}`}
  const nameCell = idx => vertical ? {gridRow: 1, gridColumn: idx + 2} : {gridRow: n - idx, gridColumn: 1}
  const numberCell = fret => vertical ? {gridRow: fret + 2, gridColumn: 1} : {gridRow: n + 1, gridColumn: fret + 2}
  const boardSpan = vertical
    ? {gridRow: `2 / ${lastFret + 1}`, gridColumn: `2 / ${n + 2}`}
    : {gridRow: `1 / ${n + 1}`, gridColumn: `2 / ${lastFret + 1}`}

  const template = vertical
    ? {
        gridTemplateColumns: `24px repeat(${n}, minmax(0, 1fr))`,
        gridTemplateRows: `28px 48px ${frets.slice(1).map(f => Math.round(0.62 * f.grow) + 'px').join(' ')}`,
      }
    : {
        gridTemplateColumns: `28px 52px ${frets.slice(1).map(f => f.grow + 'fr').join(' ')}`,
        gridTemplateRows: `repeat(${n}, 44px) 24px`,
      }

  return <div
    className={cx('neck', vertical ? 'neck--vertical' : 'neck--horizontal')}
    style={template}
    role="img"
    aria-label={`Neck with ${fretCount} frets showing ${chord ? `${chord.name} in ` : ''}${key.title}`}
  >
    <div className="neck__board" style={boardSpan} />

    {frets.map(f => <div key={f.fret} className={cx('neck__fret', {'neck__fret--nut': f.fret === 0})} style={fretSpan(f.fret)}>
      {f.inlay ? <span className={cx('neck__inlays', {'neck__inlays--double': f.inlay === 2})}>
        <span className="neck__inlay" />
        {f.inlay === 2 ? <span className="neck__inlay" /> : null}
      </span> : null}
    </div>)}

    {strings.map(s => <div key={s.idx} className="neck__string" style={{...stringSpan(s.idx), '--gauge': `${s.gauge}px`}}>
      <span className={cx('neck__wire', {'neck__wire--wound': s.wound})} />
    </div>)}

    {strings.map(s => <span key={s.idx} className="neck__name" style={nameCell(s.idx)}>{s.name}</span>)}

    {frets.map(f => <span key={f.fret} className={cx('neck__number', {'neck__number--inlay': f.inlay})} style={numberCell(f.fret)}>
      {f.fret}
    </span>)}

    {cells.map(c => <span key={c.id} className="neck__cell" style={cell(c.idx, c.fret)}>
      <span className={cx('dot', `dot--${c.kind}`, {'dot--faded': c.faded})}>{c.label}</span>
    </span>)}
  </div>
}
