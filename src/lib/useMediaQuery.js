import {useEffect, useState} from 'react'


const matches = query => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(query).matches


export default function useMediaQuery(query) {
  const [match, setMatch] = useState(() => matches(query))

  useEffect(() => {
    if (!window.matchMedia) return

    const list = window.matchMedia(query)
    const onChange = () => setMatch(list.matches)
    onChange()
    list.addEventListener('change', onChange)

    return () => list.removeEventListener('change', onChange)
  }, [query])

  return match
}
