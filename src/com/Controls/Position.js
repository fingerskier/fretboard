import {useEffect, useState} from 'react'
import {useGuitar} from '../../guitarContext'

const numPositions = 17


export default function Position() {
  const [state, setState] = useGuitar()
  
  const [position, setPosition] = useState()
  
  
  const handleOctaveChange = (e)=>{
    if (e.target.value === 'All') {
      setPosition(null)
    } else {
      setPosition(+e.target.value)
    }
  }
  
  
  useEffect(() => {
    setState({
      ...state,
      position,
    })
  }, [position])
  
  
  return <div>
    Highlight notes only in a certain position:
    
    <select
      value={position}
      onChange={handleOctaveChange}
      size={9}
    >
      <option value={null}> All </option>
      
      {Array.from({length: numPositions}).map((_, i)=><option
        value={i}
      >
        {i}
      </option>)}
    </select>
  </div>
}