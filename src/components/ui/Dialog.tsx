import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

type DialogProps = {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
  footer?: ReactNode
  presentation?: 'modal' | 'sheet'
}

export function Dialog({ open, title, children, onClose, footer, presentation = 'modal' }: DialogProps) {
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, open])

  if (!open) return null

  return (
    <div className="dialog-layer" role="presentation">
      <button type="button" className="dialog-layer__backdrop" onClick={onClose} aria-label="بستن پنجره" />
      <section className={`dialog dialog--${presentation}`} role="dialog" aria-modal="true" aria-label={title}>
        <header className="dialog__header"><h2>{title}</h2><button type="button" onClick={onClose} aria-label="بستن"><X /></button></header>
        <div className="dialog__body">{children}</div>
        {footer && <footer className="dialog__footer">{footer}</footer>}
      </section>
    </div>
  )
}
