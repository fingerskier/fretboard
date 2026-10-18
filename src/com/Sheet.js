import {useEffect, useId, useRef} from 'react'


// Bottom sheet for phones. Done, the backdrop and Escape all close it; focus returns to the opener.
export default function Sheet({title, open, onClose, children}) {
  const titleId = useId()
  const sheet = useRef(null)
  const opener = useRef(null)

  useEffect(() => {
    if (!open) return

    opener.current = document.activeElement
    sheet.current?.focus()

    return () => opener.current?.focus?.()
  }, [open])

  if (!open) return null

  return <div className="sheet-layer">
    <button type="button" className="sheet-layer__scrim" tabIndex={-1} aria-label="Close" onClick={onClose} />

    <div
      className="sheet"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      ref={sheet}
      onKeyDown={e => { if (e.key === 'Escape') onClose() }}
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
