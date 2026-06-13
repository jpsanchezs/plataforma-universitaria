import type { Course } from '@/types/academic'
import type { AdminCoursesStorage, AdminPeriodsStorage, AdminTeachersStorage } from '@/features/admin/types'
import {
  getCourseEnrollmentCount,
  getEffectiveAvailableSeats,
  getEffectivePeriodById,
  getEffectiveTeacherById,
} from '@/data/selectors'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { formatNumber } from '@/utils/formatters'

interface CoursesTableProps {
  courses: Course[]
  courseStorage: AdminCoursesStorage
  teacherStorage: AdminTeachersStorage
  periodStorage: AdminPeriodsStorage
  onView: (course: Course) => void
  onEdit: (course: Course) => void
  onToggleStatus: (course: Course) => void
}

export function CoursesTable({
  courses,
  courseStorage,
  teacherStorage,
  periodStorage,
  onView,
  onEdit,
  onToggleStatus,
}: CoursesTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-primary/10 bg-card">
      <table className="min-w-full text-sm">
        <thead className="bg-primary/5">
          <tr>
            {[
              'Código',
              'Nombre',
              'Créditos',
              'Docente',
              'Período',
              'Capacidad',
              'Matriculados',
              'Cupo',
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
          {courses.map((course) => {
            const enrolled = Math.max(course.enrolled, getCourseEnrollmentCount(course.id))
            const availableSeats = getEffectiveAvailableSeats(course.id, courseStorage)
            const teacher = getEffectiveTeacherById(course.teacherId, teacherStorage)
            const period = getEffectivePeriodById(course.periodId, periodStorage)

            return (
              <tr key={course.id} className="hover:bg-primary/5">
                <td className="px-4 py-3 font-medium text-text">{course.code}</td>
                <td className="px-4 py-3 text-text">{course.name}</td>
                <td className="px-4 py-3 text-text">{course.credits}</td>
                <td className="px-4 py-3 text-text">{teacher?.fullName ?? '—'}</td>
                <td className="px-4 py-3 text-text">{period?.name ?? '—'}</td>
                <td className="px-4 py-3 text-text">{formatNumber(course.capacity)}</td>
                <td className="px-4 py-3 text-text">{formatNumber(enrolled)}</td>
                <td className="px-4 py-3 text-text">{formatNumber(availableSeats)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={course.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => onView(course)}>
                      Ver
                    </Button>
                    <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => onEdit(course)}>
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      className="px-2 py-1 text-xs"
                      onClick={() => onToggleStatus(course)}
                    >
                      {course.status === 'activo' ? 'Inactivar' : 'Activar'}
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
