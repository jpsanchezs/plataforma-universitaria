import type { InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const fieldClassName =
  'w-full rounded-lg border border-primary/20 bg-card px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50'

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-text">
          {label}
        </label>
      ) : null}
      <input id={inputId} className={cn(fieldClassName, error && 'border-danger')} {...props} />
      {error ? <p className="mt-1 text-xs text-danger">{error}</p> : null}
    </div>
  )
}
