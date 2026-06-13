import type { ChangeRequestViewModel } from '@/features/executive/types'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Table, type TableColumn } from '@/components/ui/Table'

interface ChangeRequestsTableProps {
  requests: ChangeRequestViewModel[]
}

function impactLabel(value: 'bajo' | 'medio' | 'alto'): string {
  if (value === 'alto') {
    return 'Alto'
  }
  if (value === 'medio') {
    return 'Medio'
  }
  return 'Bajo'
}

export function ChangeRequestsTable({ requests }: ChangeRequestsTableProps) {
  const columns: TableColumn<ChangeRequestViewModel>[] = [
    { key: 'id', header: 'ID', render: (row) => row.id },
    {
      key: 'title',
      header: 'Título',
      render: (row) => (
        <div>
          <p className="font-medium text-text">{row.title}</p>
          <p className="text-xs text-muted">{row.description}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'scope',
      header: 'Alcance',
      render: (row) => impactLabel(row.scopeImpact),
    },
    {
      key: 'time',
      header: 'Tiempo',
      render: (row) => impactLabel(row.timeImpact),
    },
    {
      key: 'cost',
      header: 'Costo',
      render: (row) => impactLabel(row.costImpact),
    },
    {
      key: 'recommendation',
      header: 'Recomendación',
      render: (row) => row.recommendation,
      className: 'max-w-sm',
    },
  ]

  return (
    <Table
      columns={columns}
      data={requests}
      emptyMessage="No hay solicitudes de cambio abiertas."
    />
  )
}
