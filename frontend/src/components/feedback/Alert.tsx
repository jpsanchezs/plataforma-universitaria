import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface AlertProps {
  variant: 'success' | 'error' | 'info'
  children: ReactNode
  className?: string
  onDismiss?: () => void
}

const variantStyles: Record<AlertProps['variant'], string> = {
  success: 'border-success/30 bg-success/10 text-success',
  error: 'border-danger/30 bg-danger/10 text-danger',
  info: 'border-primary/20 bg-primary/5 text-primary',
}

export function Alert({ variant, children, className, onDismiss }: AlertProps) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm',
        variantStyles[variant],
        className,
      )}
      role="alert"
    >
      <div>{children}</div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-xs font-medium underline"
        >
          Cerrar
        </button>
      ) : null}
    </div>
  )
}
