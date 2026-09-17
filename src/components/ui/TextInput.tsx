import type { InputHTMLAttributes, ReactNode } from 'react'

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: ReactNode
  error?: ReactNode
  containerClassName?: string
}

export function TextInput({ label, hint, error, id, containerClassName, className, ...props }: TextInputProps) {
  const inputId = id || props.name
  return (
    <label className={['field', containerClassName].filter(Boolean).join(' ')} htmlFor={inputId}>
      <span className="field__label">{label}</span>
      <input {...props} id={inputId} className={['field__control', error ? 'is-invalid' : '', className].filter(Boolean).join(' ')} aria-invalid={Boolean(error) || undefined} aria-describedby={hint || error ? `${inputId}-hint` : undefined} />
      {(hint || error) && <span id={`${inputId}-hint`} className={error ? 'field__error' : 'field__hint'}>{error || hint}</span>}
    </label>
  )
}
