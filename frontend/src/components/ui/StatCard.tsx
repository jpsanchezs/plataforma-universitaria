import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface StatCardProps {
  label: string
  value: string
  hint?: string
  icon?: ReactNode
  className?: string
}

export function StatCard({ label, value, hint, icon, className }: StatCardProps) {
  return (
    <article
      className={cn(
        'rounded-xl border border-primary/10 bg-card p-5 shadow-sm',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-2 text-2xl font-bold text-text">{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
        </div>
        {icon ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        ) : null}
      </div>
    </article>
  )
}
