import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface CardProps {
  title: string
  description?: string
  icon?: ReactNode
  footer?: ReactNode
  className?: string
}

export function Card({ title, description, icon, footer, className }: CardProps) {
  return (
    <article
      className={cn(
        'flex flex-col rounded-xl border border-primary/10 bg-card p-5 shadow-sm transition-shadow hover:shadow-md',
        className,
      )}
    >
      {icon ? (
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      ) : null}
      <h3 className="text-base font-semibold text-text">{title}</h3>
      {description ? (
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{description}</p>
      ) : null}
      {footer ? <div className="mt-4">{footer}</div> : null}
    </article>
  )
}
