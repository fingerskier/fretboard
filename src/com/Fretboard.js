import {useEffect, useState} from 'react'
import String from './String'
import {useGuitar} from '../guitarContext'


export default function Fretboard({
  numberOfFrets=22,
  // strings prop removed, will use tuning from context
}) {
  const { tuning } = useGuitar(); // Changed to get tuning from context
  
  const [startingNotes, setStartingNotes] = useState([])
  
  
  useEffect(() => {
    if (tuning?.map) { // Changed from strings to tuning
      setStartingNotes([...tuning].reverse()) // Changed from strings to tuning
    }
  }, [tuning]) // Changed from strings to tuning
  
  
  return <>
    {startingNotes.map((string, I)=>
      <String
        key={I}
        length={numberOfFrets}
        number={I+1}
        openNote={string}
      />
    )}
    
    {/* <pre> {JSON.stringify(tuning, null, 2)} </pre> {/* Optionally log tuning for debugging */}
  </>
}