import type { AttendanceStatus } from '@/types/academic'
import type { AttendanceRow } from '@/features/teacher/types'
import { Select } from '@/components/ui/Select'
import { Table, type TableColumn } from '@/components/ui/Table'
import { StatusBadge } from '@/components/ui/StatusBadge'

const statusOptions = [
  { value: 'presente', label: 'Presente' },
  { value: 'ausente', label: 'Ausente' },
  { value: 'justificado', label: 'Justificado' },
]

interface AttendanceTableProps {
  rows: AttendanceRow[]
  onStatusChange: (studentId: string, status: AttendanceStatus) => void
}

export function AttendanceTable({ rows, onStatusChange }: AttendanceTableProps) {
  const columns: TableColumn<AttendanceRow & { id: string }>[] = [
    { key: 'carnet', header: 'Carnet', render: (row) => row.carnet },
    { key: 'name', header: 'Nombre', render: (row) => row.fullName },
    { key: 'career', header: 'Carrera', render: (row) => row.career },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'action',
      header: 'Acción',
      render: (row) => (
        <Select
          className="min-w-40"
          aria-label={`Asistencia de ${row.fullName}`}
          value={row.status}
          options={statusOptions}
          onChange={(event) =>
            onStatusChange(row.studentId, event.target.value as AttendanceStatus)
          }
        />
      ),
    },
  ]

  const tableData = rows.map((row) => ({ ...row, id: row.studentId }))

  return (
    <Table
      columns={columns}
      data={tableData}
      emptyMessage="No hay estudiantes matriculados en este curso."
    />
  )
}
