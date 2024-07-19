import React from 'react'
import Main from './com/Main'
import { GuitarProvider } from './guitarContext'


import './App.css'


function App() {
  return <GuitarProvider>
    <header>
      Fretboard Explorer
    </header>
    
    <Main />
    
    <footer>
    </footer>
  </GuitarProvider>
}

export default App;
