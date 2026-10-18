import {useState} from 'react'
import KeyCircle from './KeyCircle'
import KeyDetails from './KeyDetails'
import Legend from './Legend'
import Neck from './Neck'
import {ChordSelect, ChordSource, FretSelect, LabelPicker, PositionStepper, SeventhsToggle, ShowAllToggle, StringGroupSelect} from './Controls'
import {TuningEditor, TuningSelect, usePreset} from './Tuning'


export default function DesktopLayout() {
  const [editTuning, setEditTuning] = useState(false)
  const {names} = usePreset()

  return <div className="app app--desktop">
    <header className="topbar">
      <h1>Fretboard Explorer</h1>

      <div className="topbar__tuning">
        <span className="topbar__names" aria-hidden="true">{names}</span>
        <TuningSelect />
        <button type="button" className="button" aria-expanded={editTuning} onClick={() => setEditTuning(!editTuning)}>
          {editTuning ? 'Close' : 'Edit strings'}
        </button>
      </div>
    </header>

    {editTuning ? <section className="panel" aria-label="Tuning by string">
      <TuningEditor />
    </section> : null}

    <section className="panel key-panel" aria-label="Key">
      <KeyCircle />
      <KeyDetails />
    </section>

    <section className="panel neck-panel" aria-label="Neck">
      <div className="toolbar">
        <LabelPicker />
        <ChordSelect />
        <SeventhsToggle />
        <PositionStepper />
        <StringGroupSelect />
        <FretSelect />
        <ShowAllToggle />
      </div>
      <ChordSource />

      <div className="neck-scroll">
        <Neck />
      </div>

      <Legend />
    </section>
  </div>
}
