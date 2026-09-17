import type { ReactNode } from 'react'
import { AlertTriangle, Inbox, LoaderCircle } from 'lucide-react'
import { Button } from './Button'

type StatePanelProps = {
  kind: 'loading' | 'empty' | 'error'
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  children?: ReactNode
}

export function StatePanel({ kind, title, description, actionLabel, onAction, children }: StatePanelProps) {
  const Icon = kind === 'loading' ? LoaderCircle : kind === 'error' ? AlertTriangle : Inbox
  return (
    <section className={`state-panel state-panel--${kind}`} aria-live={kind === 'loading' ? 'polite' : undefined}>
      <Icon className={kind === 'loading' ? 'spin' : undefined} aria-hidden="true" />
      <div><h2>{title}</h2>{description && <p>{description}</p>}{children}</div>
      {actionLabel && onAction && <Button variant={kind === 'error' ? 'secondary' : 'ghost'} onClick={onAction}>{actionLabel}</Button>}
    </section>
  )
}
