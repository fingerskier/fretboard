import {useEffect, useState} from 'react'
import {useGuitar} from '../../guitarContext'

const numVoices = 4


export default function Voice() {
  const [state, setState] = useGuitar()
  
  const [voice, setVoice] = useState()
  
  
  const handleOctaveChange = (e)=>{
    if (e.target.value === 'All') {
      setVoice(null)
    } else {
      setVoice(+e.target.value)
    }
  }
  
  
  useEffect(() => {
    setState({
      ...state,
      voice,
    })
  }, [voice])
  
  
  return <div>
    <label>
      Highlight notes only in a certain voice:
      
      <select
        value={voice}
        onChange={handleOctaveChange}
        size={9}
      >
        <option value={null}> All </option>
        
        {Array.from({length: numVoices}).map((_, i)=><option
          value={i+1}
          >
          {i+1}
        </option>)}
      </select>
    </label>
    <sub>a voice is a group of 3 strings</sub>
  </div>
}