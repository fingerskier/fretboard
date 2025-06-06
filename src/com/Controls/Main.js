import Chords from './Chords'
import Notes from './Notes'
import Octave from './Octave'
import Position from './Position'
import Voice from './Voice'
import Tuning from './Tuning';


export default function Controls() {
  return <div id="controls">
    <h3>Controls</h3>
    
    <Chords />
    
    <Position />
    
    <Voice />
    
    <Notes />
    
    <Octave />
    
    <Tuning />

    {/* <pre>{JSON.stringify(state,null,2)}</pre> */}
  </div>
}