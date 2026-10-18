import {useEffect, useId, useRef} from 'react'

const FOCUSABLE = 'button:not([disabled]), select:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'


// Bottom sheet for phones. Done, the backdrop and Escape all close it.
// While open, the rest of the app is inert and Tab cycles inside the sheet; focus returns to the opener.
export default function Sheet({title, open, onClose, children}) {
  const titleId = useId()
  const layer = useRef(null)
  const sheet = useRef(null)

  useEffect(() => {
    if (!open) return

    const opener = document.activeElement
    const background = [...layer.current.parentElement.children].filter(el => el !== layer.current)
    background.forEach(el => el.setAttribute('inert', ''))
    sheet.current.focus()

    return () => {
      background.forEach(el => el.removeAttribute('inert'))
      opener?.focus?.()
    }
  }, [open])

  const onKeyDown = e => {
    if (e.key === 'Escape') {
      onClose()
      return
    }
    if (e.key !== 'Tab') return

    const items = [...sheet.current.querySelectorAll(FOCUSABLE)]
    if (!items.length) return

    const first = items[0]
    const last = items[items.length - 1]
    const active = document.activeElement

    if (e.shiftKey && (active === first || active === sheet.current)) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && active === last) {
      e.preventDefault()
      first.focus()
    }
  }

  if (!open) return null

  return <div className="sheet-layer" ref={layer}>
    <button type="button" className="sheet-layer__scrim" tabIndex={-1} aria-label="Close" onClick={onClose} />

    <div
      className="sheet"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      ref={sheet}
      onKeyDown={onKeyDown}
    >
      <span className="sheet__handle" aria-hidden="true" />

      <div className="sheet__head">
        <h2 id={titleId}>{title}</h2>
        <button type="button" className="button button--primary" onClick={onClose}>Done</button>
      </div>

      <div className="sheet__body">
        {children}
      </div>
    </div>
  </div>
}
