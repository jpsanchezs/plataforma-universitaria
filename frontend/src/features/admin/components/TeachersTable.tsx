import type { Teacher } from '@/types/academic'
import type { AdminCoursesStorage } from '@/features/admin/types'
import { getCoursesCountByTeacherId } from '@/data/selectors'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { formatNumber } from '@/utils/formatters'

interface TeachersTableProps {
  teachers: Teacher[]
  courseStorage: AdminCoursesStorage
  onView: (teacher: Teacher) => void
  onEdit: (teacher: Teacher) => void
  onChangeStatus: (teacher: Teacher) => void
}

export function TeachersTable({
  teachers,
  courseStorage,
  onView,
  onEdit,
  onChangeStatus,
}: TeachersTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-primary/10 bg-card">
      <table className="min-w-full text-sm">
        <thead className="bg-primary/5">
          <tr>
            {[
              'Nombre',
              'Departamento',
              'Especialidad',
              'Cursos asignados',
              'Estado',
              'Acciones',
            ].map((header) => (
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
          {teachers.map((teacher) => (
            <tr key={teacher.id} className="hover:bg-primary/5">
              <td className="px-4 py-3 font-medium text-text">{teacher.fullName}</td>
              <td className="px-4 py-3 text-text">{teacher.department}</td>
              <td className="px-4 py-3 text-text">{teacher.specialty}</td>
              <td className="px-4 py-3 text-text">
                {formatNumber(getCoursesCountByTeacherId(teacher.id, courseStorage))}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={teacher.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => onView(teacher)}>
                    Ver
                  </Button>
                  <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => onEdit(teacher)}>
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    className="px-2 py-1 text-xs"
                    onClick={() => onChangeStatus(teacher)}
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
