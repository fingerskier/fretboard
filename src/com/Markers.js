import {useEffect, useState} from 'react'
import Cell from './Cell'
import { noteIndex } from '../lib/helpers'


export default function Markers({
  length=21,
}) {
  const [notes, setNotes] = useState([])
  
  
  useEffect(() => {
    if (length && openNote) {
      const newNotes = []
      
      let startingNote = noteIndex(openNote)
      let prevNote = 127
      
      for (
        let I = startingNote;
        I < startingNote+length;
        I++
      ) {
        newNotes.push(I)
      }
      
      setNotes(newNotes)
    }
  }, [length, openNote])
  
  
  return <div className="string">
    {notes?.map && notes.map((N, I)=>
      <Cell
        fret={I}
        key={I}
        noteIndex={N}
        string={number}
      />
    )}
  </div>
}