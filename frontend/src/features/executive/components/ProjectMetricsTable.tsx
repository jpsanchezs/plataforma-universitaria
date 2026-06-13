import type { ProjectMetricsByCategory } from '@/features/executive/types'
import { calculateMetricVariation } from '@/data/selectors'
import { MetricStatusBadge } from '@/features/executive/components/MetricStatusBadge'
import { Table, type TableColumn } from '@/components/ui/Table'
import type { ProjectMetric } from '@/types/project'
import { formatNumber, formatPercentage } from '@/utils/formatters'

interface ProjectMetricsTableProps {
  categories: ProjectMetricsByCategory[]
}

function formatMetricValue(value: number, unit: string): string {
  return unit === '%' ? formatPercentage(value, 1) : `${formatNumber(value)} ${unit}`
}

export function ProjectMetricsTable({ categories }: ProjectMetricsTableProps) {
  const rows = categories.flatMap((group) =>
    group.metrics.map((metric) => ({ ...metric, categoryLabel: group.label })),
  )

  const columns: TableColumn<ProjectMetric & { categoryLabel: string }>[] = [
    { key: 'category', header: 'Dimensión', render: (row) => row.categoryLabel },
    { key: 'name', header: 'KPI', render: (row) => row.name },
    {
      key: 'planned',
      header: 'Planificado',
      render: (row) => formatMetricValue(row.planned, row.unit),
    },
    {
      key: 'actual',
      header: 'Real',
      render: (row) => formatMetricValue(row.actual, row.unit),
    },
    {
      key: 'variation',
      header: 'Variación',
      render: (row) => {
        const variation = calculateMetricVariation(row)
        if (variation === null) {
          return '—'
        }
        return `${variation >= 0 ? '+' : ''}${formatPercentage(variation, 1)}`
      },
    },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => <MetricStatusBadge status={row.status} />,
    },
  ]

  return (
    <Table
      columns={columns}
      data={rows}
      emptyMessage="No hay KPIs registrados."
    />
  )
}
