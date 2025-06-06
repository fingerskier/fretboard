import {useEffect, useState} from 'react'
import {notes} from '../../lib/constants'
import {useGuitar} from '../../guitarContext'


export default function Notes() {
  const {guitarState: state, setGuitarState: setState} = useGuitar()
  
  const [chord, setChord] = useState([])
  const [highlights, setHighlights] = useState({})
  
  
  const handleNoteSelection = (e)=>{
    if (e.target.checked) {
      setChord([...chord, e.target.name])
    } else {
      setChord(chord.filter(note=>note!==e.target.name))
    }
    
    setHighlights({
      ...highlights,
      [e.target.name]: e.target.checked
    })
  }
  
  
  useEffect(() => {
    setState({
      ...state,
      highlights: highlights,
    })
  }, [highlights])
  
  
  return <div className="controls-section">
    Highlight these notes:
    
    <div className='note selector'>
      {notes?.map && notes.map((note, i)=><label
        className={`${highlights[note]? 'highlight' : ''}`}
      >
        {note}
        
        <input
          name={note}
          type="checkbox"
          onChange={handleNoteSelection}
        />
      </label>)}
    </div>
    
    <div>
      Built Chord: {chord.join(' ')}
    </div>
    
    <div>
      <label>
        Show MIDI Number
        
        <input
          type="checkbox"
          onChange={(e)=>setState({
            ...state,
            showMidi: e.target.checked
          })}
        />
      </label>
    </div>
  </div>
}
