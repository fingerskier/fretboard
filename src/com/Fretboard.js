import {useEffect, useState} from 'react'
import String from './String'
import {useGuitar} from '../guitarContext'


export default function Fretboard({
  numberOfFrets=22,
  strings=['e2', 'a2', 'd3', 'g3', 'b3', 'e3'],
}) {
  const [state] = useGuitar()
  
  const [startingNotes, setStartingNotes] = useState([])
  
  
  useEffect(() => {
    if (strings?.map) {
      setStartingNotes([...strings].reverse())
    }
  }, [strings])
  
  
  return <>
    {startingNotes.map((string, I)=>
      <String
        key={I}
        length={numberOfFrets}
        number={I}
        openNote={string}
      />
    )}
    
    {/* <pre> {JSON.stringify(state, null, 2)} </pre> */}
  </>
}