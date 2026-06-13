import type { OpenRiskViewModel } from '@/features/executive/types'
import { RiskLevelBadge } from '@/features/executive/components/RiskLevelBadge'
import { Table, type TableColumn } from '@/components/ui/Table'

interface RisksTableProps {
  risks: OpenRiskViewModel[]
}

export function RisksTable({ risks }: RisksTableProps) {
  const columns: TableColumn<OpenRiskViewModel>[] = [
    { key: 'id', header: 'ID', render: (row) => row.id },
    {
      key: 'title',
      header: 'Riesgo',
      render: (row) => (
        <div>
          <p className="font-medium text-text">{row.title}</p>
          <p className="text-xs text-muted">{row.description}</p>
        </div>
      ),
    },
    { key: 'probability', header: 'Probabilidad', render: (row) => row.probability },
    { key: 'impact', header: 'Impacto', render: (row) => row.impact },
    {
      key: 'level',
      header: 'Nivel',
      render: (row) => <RiskLevelBadge level={row.level} />,
    },
    { key: 'owner', header: 'Responsable', render: (row) => row.owner },
    {
      key: 'strategy',
      header: 'Estrategia',
      render: (row) => row.responseStrategy,
      className: 'max-w-xs',
    },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => (row.open ? 'Abierto' : 'Cerrado'),
    },
  ]

  return (
    <Table
      columns={columns}
      data={risks}
      emptyMessage="No hay riesgos abiertos."
    />
  )
}
