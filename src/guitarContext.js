import {createContext, useContext, useState} from 'react'


const GuitarContext = createContext()


export function useGuitar() {
  return useContext(GuitarContext)
}


export function GuitarProvider({children}) {
  const state = useState({})
  
  return <GuitarContext.Provider value={state}>
    {children}
  </GuitarContext.Provider>
}


export default GuitarContext