import React from 'react'
import Controls from './Controls'
import Fretboard from './Fretboard.js'


export default function Main() {
  return <main>
    <Fretboard
      numberOfFrets={22}
      strings={['e2', 'a2', 'd3', 'g3', 'c4', 'f4']}
    />
    
    <Controls.Main />
  </main>
}
