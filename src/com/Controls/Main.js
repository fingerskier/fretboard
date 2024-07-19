import {useGuitar} from '../../guitarContext'
import Chords from './Chords'
import Notes from './Notes'


export default function Controls() {
  const [state] = useGuitar()
  
  
  return <div>
    <h3>Controls</h3>
    
    <Chords />
    
    <Notes />
    
    <pre>{JSON.stringify(state,null,2)}</pre>
  </div>
}