import type { AcademicPeriod } from '@/types/academic'
import type { AdminCoursesStorage } from '@/features/admin/types'
import { getCoursesCountByPeriodId } from '@/data/selectors'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { formatNumber, formatShortDate } from '@/utils/formatters'

interface PeriodsTableProps {
  periods: AcademicPeriod[]
  courseStorage: AdminCoursesStorage
  onView: (period: AcademicPeriod) => void
  onEdit: (period: AcademicPeriod) => void
  onChangeStatus: (period: AcademicPeriod) => void
}

export function PeriodsTable({
  periods,
  courseStorage,
  onView,
  onEdit,
  onChangeStatus,
}: PeriodsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-primary/10 bg-card">
      <table className="min-w-full text-sm">
        <thead className="bg-primary/5">
          <tr>
            {['Nombre', 'Inicio', 'Fin', 'Estado', 'Cursos', 'Acciones'].map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-primary/10">
          {periods.map((period) => (
            <tr key={period.id} className="hover:bg-primary/5">
              <td className="px-4 py-3 font-medium text-text">{period.name}</td>
              <td className="px-4 py-3 text-text">{formatShortDate(period.startDate)}</td>
              <td className="px-4 py-3 text-text">{formatShortDate(period.endDate)}</td>
              <td className="px-4 py-3">
                <StatusBadge status={period.status} />
              </td>
              <td className="px-4 py-3 text-text">
                {formatNumber(getCoursesCountByPeriodId(period.id, courseStorage))}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => onView(period)}>
                    Ver
                  </Button>
                  <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => onEdit(period)}>
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    className="px-2 py-1 text-xs"
                    onClick={() => onChangeStatus(period)}
                  >
                    Estado
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
