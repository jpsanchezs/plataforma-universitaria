import type { RiskLevel } from '@/types/project'
import { MetricStatusBadge } from '@/features/executive/components/MetricStatusBadge'
import { formatNumber, formatPercentage } from '@/utils/formatters'

interface ExecutiveKpiCardProps {
  name: string
  planned: number
  actual: number
  unit: string
  status: RiskLevel
  variation?: number | null
}

export function ExecutiveKpiCard({
  name,
  planned,
  actual,
  unit,
  status,
  variation,
}: ExecutiveKpiCardProps) {
  const formattedActual = unit === '%' ? formatPercentage(actual, 1) : formatNumber(actual)
  const formattedPlanned = unit === '%' ? formatPercentage(planned, 1) : formatNumber(planned)

  return (
    <article className="rounded-xl border border-primary/10 bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-text">{name}</p>
          <p className="mt-2 text-xl font-bold text-primary">{formattedActual}</p>
          <p className="mt-1 text-xs text-muted">Planificado: {formattedPlanned}</p>
        </div>
        <MetricStatusBadge status={status} />
      </div>
      {variation !== null && variation !== undefined ? (
        <p className="mt-3 text-xs text-muted">
          Variación: {variation >= 0 ? '+' : ''}
          {formatPercentage(variation, 1)}
        </p>
      ) : null}
    </article>
  )
}
