import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface ExecutiveChartCardProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function ExecutiveChartCard({
  title,
  description,
  children,
  className,
}: ExecutiveChartCardProps) {
  return (
    <article className={cn('rounded-xl border border-primary/10 bg-card p-5 shadow-sm', className)}>
      <header className="mb-4">
        <h3 className="text-base font-semibold text-text">{title}</h3>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      </header>
      <div className="min-h-[220px]">{children}</div>
    </article>
  )
}
