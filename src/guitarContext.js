import {createContext, useContext, useState, useEffect} from 'react'

const GuitarContext = createContext()

export function useGuitar() {
  return useContext(GuitarContext)
}

const STANDARD_TUNING = ['e2', 'a2', 'd3', 'g3', 'b3', 'e3']

export function GuitarProvider({children}) {
  const existingState = useState({}) // Renamed for clarity
  const [tuning, setTuningState] = useState(() => {
    const savedTuning = localStorage.getItem('guitarTuning')
    return savedTuning ? JSON.parse(savedTuning) : STANDARD_TUNING
  })

  useEffect(() => {
    localStorage.setItem('guitarTuning', JSON.stringify(tuning))
  }, [tuning])

  const setTuning = (newTuning) => {
    setTuningState(newTuning)
  }

  const contextValue = {
    guitarState: existingState[0],
    setGuitarState: existingState[1],
    tuning,
    setTuning,
  }

  return <GuitarContext.Provider value={contextValue}>
    {children}
  </GuitarContext.Provider>
}

export default GuitarContext