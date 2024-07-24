import {useEffect, useState} from 'react'
import { indexNote } from '../lib/helpers'
import { useGuitar } from '../guitarContext'


const inPosition = (fret,position)=>{
  return ((fret-position) >= 0) && ((fret-position) < 4)
}


const inVoice = (string,voice,size=3)=>{
  // a voice is the set of adjacent strings that can be covered by all common chord shapes in a domain
  // the default of 3 represents triads, 3-finger chords
  return ((string-voice) < size) && ((string-voice) >= 0)
}


export default function Cell({
  fret,
  noteIndex,
  string,
}) {
  const [state] = useGuitar()
  
  const [highlight, setHighlight] = useState('')
  const [note, setNote] = useState(indexNote(noteIndex))
  
  
  useEffect(() => {
    setNote(indexNote(noteIndex))
  }, [noteIndex])
  
  
  useEffect(() => {
    const pitch = note[0]
    const octave = +note[1]
    
    const pitchHighlight = state.highlights? state.highlights?.[pitch]: true
    const octaveHighlight = state.octave? state.octave.includes(octave): true
    const voiceHighlight = state.voice? inVoice(string,state.voice): true
    const positionHighlight = state.position? inPosition(fret,state.position): true
    
    
    if (pitchHighlight && octaveHighlight && voiceHighlight && positionHighlight) {
      setHighlight('highlight')
    } else {
      setHighlight('')
    }
  }, [state])
  
  
  return <div className={`cell ${highlight}`}>
    {state.showMidi? <>{noteIndex}</> : <>{note}</>}
  </div>
}
