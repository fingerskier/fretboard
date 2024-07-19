import {useEffect, useState} from 'react'
import { indexNote } from '../lib/helpers'
import { useGuitar } from '../guitarContext'


export default function Cell({
  fret,
  noteIndex,
}) {
  const [state, setState] = useGuitar()
  
  const [note, setNote] = useState(indexNote(noteIndex))
  const [highlight, setHighlight] = useState('')
  
  
  useEffect(() => {
    setNote(indexNote(noteIndex))
  }, [noteIndex])
  
  
  useEffect(() => {
    if (state.highlights?.[note[0]]) {
      setHighlight('highlight')
    } else {
      setHighlight('')
    }
  }, [state.highlights])
  
  
  return <div className={`cell ${highlight}`}>
    {state.showMidi? <>{noteIndex}</> : <>{note}</>}
  </div>
}
