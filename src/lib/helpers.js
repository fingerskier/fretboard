import { intervals } from './constants.js'


const chordNotes = (root, flavor) => {
  const rootIndex = noteIndex(root)
  const intervalsArray = intervals[flavor]
  
  if (!intervalsArray) {
    throw new Error('Invalid chord flavor')
  }
  
  return intervalsArray.map(interval => (rootIndex + interval) % 12)
}


const compareNote = (note1, note2) => {
  const N1 = +note1? noteIndex(note1): note1
  const N2 = +note2? noteIndex(note2): note2
  
  return (N1 - N2 + 12) % 12
}


const notesChord = (notesArray) => {
  const intervalArray = []
  
  for (let i = 1; i < notesArray.length; i++) {
    intervals.push((notesArray[i] - notesArray[0] + 12) % 12)
  }
  
  for (const [flavor, intervalArray] of Object.entries(intervals)) {
    if (intervalArray.every(interval => intervals[flavor].includes(interval))) {
      return flavor
    }
  }
  
  return 'Unknown'
}


const noteIndex = note => {
  const noteMap = {
    'c': 0, 'C': 1,
    'd': 2, 'D': 3,
    'e': 4,
    'f': 5, 'F': 6,
    'g': 7, 'G': 8,
    'a': 9, 'A': 10,
    'b': 11,
  }
  
  const letter = note[0]
  const octave = parseInt(note.slice(1), 10) || 0
  
  if (!noteMap.hasOwnProperty(letter) || isNaN(octave)) {
    throw new Error('Invalid note format')
  }
  
  return noteMap[letter] + 12 * (octave + 1)
}


const indexNote = index => {
  if (index < 0 || index > 127) {
    throw new Error('Invalid MIDI number')
  }
  
  const noteMap = ['c', 'C', 'd', 'D', 'e', 'f', 'F', 'g', 'G', 'a', 'A', 'b']
  const octave = Math.floor(index / 12) - 1
  const note = noteMap[index % 12]
  
  return note + octave
}


export {
  chordNotes,
  compareNote,
  noteIndex,
  notesChord,
  indexNote,
}