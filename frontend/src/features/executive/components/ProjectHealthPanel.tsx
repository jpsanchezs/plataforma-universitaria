import type { ProjectHealthItem } from '@/features/executive/types'
import { MetricStatusBadge } from '@/features/executive/components/MetricStatusBadge'

interface ProjectHealthPanelProps {
  items: ProjectHealthItem[]
}

export function ProjectHealthPanel({ items }: ProjectHealthPanelProps) {
  return (
    <section className="rounded-xl border border-primary/10 bg-card p-5 shadow-sm">
      <h3 className="text-base font-semibold text-text">Estado general del proyecto</h3>
      <p className="mt-1 text-sm text-muted">
        Semáforo ejecutivo por dimensión de desempeño.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {items.map((item) => (
          <div
            key={item.category}
            className="flex items-center justify-between rounded-lg border border-primary/10 px-4 py-3"
          >
            <span className="text-sm font-medium text-text">{item.label}</span>
            <MetricStatusBadge status={item.status} />
          </div>
        ))}
      </div>
    </section>
  )
}
