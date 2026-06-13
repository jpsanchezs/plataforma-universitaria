import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface FilterBarProps {
  children: ReactNode
  className?: string
}

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-xl border border-primary/10 bg-card p-4 sm:flex-row sm:flex-wrap sm:items-end',
        className,
      )}
    >
      {children}
    </div>
  )
}
