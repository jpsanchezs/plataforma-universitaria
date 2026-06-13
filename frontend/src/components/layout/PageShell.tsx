import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface PageShellProps {
  children: ReactNode
  className?: string
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8', className)}>
      {children}
    </div>
  )
}
