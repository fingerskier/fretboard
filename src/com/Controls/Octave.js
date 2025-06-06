import {useEffect, useState} from 'react'
import {notes} from '../../lib/constants'
import {useGuitar} from '../../guitarContext'


export default function Notes() {
  const [state, setState] = useGuitar()
  
  const [octave, setOctave] = useState()
  
  
  const handleOctaveChange = (e)=>{
    if (e.target.value === 'All') {
      setOctave(null)
    } else {
      const value = Array.from(e.target.selectedOptions).map(o=>+o.value)
      setOctave(value.length? value : null)
    }
  }
  
  
  useEffect(() => {
    setState({
      ...state,
      octave,
    })
  }, [octave])
  
  
  return <div className="controls-section">
    Highlight notes only in a certain octave:
    
    <label>
      <select
        value={octave}
        onChange={handleOctaveChange}
        multiple={true}
        size={8}
      >
        <option value={null}> All </option>
        
        {Array.from({length: 7}).map((_, i)=><option
          value={i}
        >
          {i}
        </option>)}
      </select>
    </label>
  </div>
}