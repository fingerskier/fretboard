import {useGuitar} from '../../guitarContext'
import Chords from './Chords'
import Notes from './Notes'
import Octave from './Octave'
import Position from './Position'
import Voice from './Voice'


export default function Controls() {
  const [state] = useGuitar()
  
  
  return <div id="controls">
    <h3>Controls</h3>
    
    <Chords />
    
    <Position />
    
    <Voice />
    
    <Notes />
    
    <Octave />
    
    {/* <pre>{JSON.stringify(state,null,2)}</pre> */}
  </div>
}