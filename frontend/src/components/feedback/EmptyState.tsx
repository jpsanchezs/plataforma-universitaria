import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  className?: string
}

export function EmptyState({ title, description, icon, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-primary/20 bg-card px-6 py-12 text-center',
        className,
      )}
    >
      {icon ? (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      ) : null}
      <h3 className="text-base font-semibold text-text">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
      ) : null}
    </div>
  )
}
