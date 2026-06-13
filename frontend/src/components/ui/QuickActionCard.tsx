import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface QuickActionCardProps {
  title: string
  description: string
  actionLabel?: string
  to?: string
  icon?: ReactNode
  className?: string
}

const actionButtonClassName =
  'mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary/20 bg-card px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30'

export function QuickActionCard({
  title,
  description,
  actionLabel = 'Ir al módulo',
  to,
  icon,
  className,
}: QuickActionCardProps) {
  return (
    <article
      className={cn(
        'flex flex-col rounded-xl border border-primary/10 bg-card p-5 shadow-sm',
        className,
      )}
    >
      {icon ? (
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
          {icon}
        </div>
      ) : null}
      <h3 className="text-sm font-semibold text-text">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted">{description}</p>
      {to ? (
        <Link to={to} className={actionButtonClassName}>
          {actionLabel}
        </Link>
      ) : (
        <span className={cn(actionButtonClassName, 'cursor-not-allowed opacity-50')}>
          Próximamente
        </span>
      )}
    </article>
  )
}
