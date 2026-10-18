import {useState} from 'react'
import {useGuitar} from '../guitarContext'
import KeyCircle from './KeyCircle'
import {Degrees, ModeSelect} from './KeyDetails'
import Legend from './Legend'
import Neck from './Neck'
import Sheet from './Sheet'
import {ChordGrid, ChordSource, Chevron, FretSelect, LabelPicker, PositionStepper, SeventhsToggle, ShowAllToggle, StringGroupSelect} from './Controls'
import {TuningEditor, TuningList, usePreset} from './Tuning'
import cx from '../lib/cx'


const icons = {
  key: <path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />,
  chord: <path d="M12 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm0 7a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm0 7a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
  view: <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />,
  tuning: <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />,
}


function Tab({id, label, open, setOpen}) {
  return <button type="button" className={cx('tabbar__tab', {on: open === id})} aria-haspopup="dialog" onClick={() => setOpen(id)}>
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[id]}
    </svg>
    {label}
  </button>
}


export default function PhoneLayout() {
  const {key, chord} = useGuitar()
  const {preset} = usePreset()
  const [open, setOpen] = useState(null)
  const close = () => setOpen(null)

  return <div className="app app--phone">
    <header className="phone-top">
      <button type="button" className="key-button" aria-haspopup="dialog" onClick={() => setOpen('key')}>
        <span className="key-button__root">{key.rootName}</span>
        <span className="key-button__mode">{key.scale.label.toLowerCase()}</span>
        <span className="pill">{key.signature}</span>
        <Chevron />
      </button>

      <Degrees className="degrees--strip" />
    </header>

    <main className="phone-neck">
      <Neck vertical />
    </main>

    <nav className="tabbar" aria-label="Controls">
      <Tab id="key" label="Key" open={open} setOpen={setOpen} />
      <Tab id="chord" label={chord ? chord.name : 'Chord'} open={open} setOpen={setOpen} />
      <Tab id="view" label="View" open={open} setOpen={setOpen} />
      <Tab id="tuning" label={preset ? preset.label : 'Custom'} open={open} setOpen={setOpen} />
    </nav>

    <Sheet title="Key" open={open === 'key'} onClose={close}>
      <KeyCircle />
      <ModeSelect />
    </Sheet>

    <Sheet title="Chord" open={open === 'chord'} onClose={close}>
      <SeventhsToggle />
      <ChordSource />
      <ChordGrid />
    </Sheet>

    <Sheet title="View" open={open === 'view'} onClose={close}>
      <LabelPicker />
      <PositionStepper />
      <div className="sheet__row">
        <StringGroupSelect />
        <FretSelect />
      </div>
      <ShowAllToggle />
      <Legend />
    </Sheet>

    <Sheet title="Tuning" open={open === 'tuning'} onClose={close}>
      <TuningList />
      <TuningEditor />
    </Sheet>
  </div>
}
