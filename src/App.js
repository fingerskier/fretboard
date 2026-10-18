import React from 'react'
import {GuitarProvider} from './guitarContext'
import DesktopLayout from './com/DesktopLayout'
import PhoneLayout from './com/PhoneLayout'
import useMediaQuery from './lib/useMediaQuery'


import './App.css'

export const PHONE_QUERY = '(max-width: 719px)'


function App() {
  const phone = useMediaQuery(PHONE_QUERY)

  return <GuitarProvider>
    {phone ? <PhoneLayout /> : <DesktopLayout />}
  </GuitarProvider>
}

export default App;
