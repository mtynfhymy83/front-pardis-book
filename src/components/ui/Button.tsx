import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'white'

function classNames(variant: ButtonVariant, className?: string) {
  return ['button', `button--${variant}`, className].filter(Boolean).join(' ')
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  children: ReactNode
}

export function Button({ variant = 'primary', className, type = 'button', children, ...props }: ButtonProps) {
  return <button {...props} type={type} className={classNames(variant, className)}>{children}</button>
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant
  children: ReactNode
}

export function ButtonLink({ variant = 'primary', className, children, ...props }: ButtonLinkProps) {
  return <a {...props} className={classNames(variant, className)}>{children}</a>
}
