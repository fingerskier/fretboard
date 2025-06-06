import {useEffect, useState} from 'react'
import {intervals, notes} from '../../lib/constants'
import {useGuitar} from '../../guitarContext'
import {chordNotes, indexNote, noteIndex} from '../../lib/helpers'


export default function Chords() {
  const [state, setState] = useGuitar()
  
  const [flavor, setFlavor] = useState('M')
  const [localNotes, setLocalNotes] = useState([])
  const [root, setRoot] = useState()
  
  
  useEffect(() => {
    if (root && flavor) {
      setLocalNotes(chordNotes(root, flavor))
    }
  }, [root, flavor])
  
  
  useEffect(() => {
    if (localNotes?.length) {
      const newHighlights = {}
      
      console.log(localNotes)
      notes.forEach(X=>{
        const baseNoteI = noteIndex(X)%12
        newHighlights[X] = localNotes.includes(baseNoteI)
      })
      
      setState({
        ...state,
        highlights: newHighlights,
      })
    }
  }, [localNotes])
  
  
  return <div className="controls-section">
    Highlight notes in this chord:
    
    <select
      value={root}
      onChange={(e)=>setRoot(e.target.value)}
    >
      <option value={null}>Select Root</option>
      
      {notes.map(note=><option
        value={note}
      >
        {note}
      </option>)}
    </select>
    
    {root? 
      <select
        value={flavor}
        onChange={(e)=>setFlavor(e.target.value)}
      >
        <option value={null}>Select Flavor</option>
        
        {Object.keys(intervals).map(flavor=><option
          value={flavor}
          >
          {flavor}
        </option>)}
      </select>
    : null}
    
    <pre>{JSON.stringify(localNotes)}</pre>
  </div>
}