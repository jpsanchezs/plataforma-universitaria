import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { PageShell } from '@/components/layout/PageShell'

export interface PlaceholderStat {
  title: string
  description: string
}

export interface PreviewStat {
  label: string
  value: string
}

interface ModulePlaceholderProps {
  title: string
  description: string
  stats: PlaceholderStat[]
  previewStats?: PreviewStat[]
  headerActions?: ReactNode
}

export function ModulePlaceholder({
  title,
  description,
  stats,
  previewStats,
  headerActions,
}: ModulePlaceholderProps) {
  return (
    <PageShell>
      <PageHeader title={title} description={description} actions={headerActions} />

      {previewStats && previewStats.length > 0 ? (
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {previewStats.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-3"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                {item.label}
              </p>
              <p className="mt-1 text-lg font-semibold text-primary">{item.value}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} title={stat.title} description={stat.description} />
        ))}
      </div>

      <div className="rounded-xl border border-dashed border-primary/20 bg-primary/5 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge variant="warning" className="mb-2">
              Módulo en construcción
            </Badge>
            <p className="text-sm text-text">
              La funcionalidad completa de este módulo se implementará en fases
              posteriores del prototipo. Por ahora, esta vista valida navegación,
              permisos y diseño base.
            </p>
          </div>
          <Button variant="secondary" disabled className="shrink-0">
            Acción simulada
          </Button>
        </div>
      </div>
    </PageShell>
  )
}
