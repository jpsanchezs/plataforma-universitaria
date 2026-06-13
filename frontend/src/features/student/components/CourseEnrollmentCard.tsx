import type { CourseWithEnrollmentMeta } from '@/data/selectors'
import type { CourseEnrollmentStatus } from '@/features/student/types'
import { ActionButton } from '@/components/ui/ActionButton'
import { Badge } from '@/components/ui/Badge'

interface CourseEnrollmentCardProps {
  course: CourseWithEnrollmentMeta
  status: CourseEnrollmentStatus
  onEnroll?: () => void
  onDrop?: () => void
}

const statusBadgeMap: Record<
  CourseEnrollmentStatus,
  { label: string; variant: 'default' | 'success' | 'warning' | 'danger' }
> = {
  disponible: { label: 'Disponible', variant: 'default' },
  matriculado: { label: 'Matriculado', variant: 'success' },
  sin_cupo: { label: 'Sin cupo', variant: 'danger' },
}

export function CourseEnrollmentCard({
  course,
  status,
  onEnroll,
  onDrop,
}: CourseEnrollmentCardProps) {
  const badge = statusBadgeMap[status]

  return (
    <article className="flex flex-col rounded-xl border border-primary/10 bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            {course.code}
          </p>
          <h3 className="mt-1 text-base font-semibold text-text">{course.name}</h3>
        </div>
        <Badge variant={badge.variant}>{badge.label}</Badge>
      </div>

      <dl className="space-y-2 text-sm text-muted">
        <div className="flex justify-between gap-2">
          <dt>Créditos</dt>
          <dd className="font-medium text-text">{course.credits}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Docente</dt>
          <dd className="text-right font-medium text-text">{course.teacherName}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Horario</dt>
          <dd className="text-right font-medium text-text">{course.scheduleSummary}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Cupo disponible</dt>
          <dd className="font-medium text-text">{course.availableSeats}</dd>
        </div>
      </dl>

      <div className="mt-4">
        {status === 'matriculado' ? (
          <ActionButton variant="secondary" className="w-full" onClick={onDrop}>
            Retirar curso
          </ActionButton>
        ) : (
          <ActionButton
            variant="primary"
            className="w-full"
            disabled={status === 'sin_cupo'}
            onClick={onEnroll}
          >
            Matricular
          </ActionButton>
        )}
      </div>
    </article>
  )
}

export function CourseEnrollmentTableRow({
  course,
  status,
  onEnroll,
  onDrop,
}: CourseEnrollmentCardProps) {
  const badge = statusBadgeMap[status]

  return (
    <tr className="hover:bg-primary/5">
      <td className="px-4 py-3 font-medium text-text">{course.code}</td>
      <td className="px-4 py-3 text-text">{course.name}</td>
      <td className="px-4 py-3 text-center text-text">{course.credits}</td>
      <td className="px-4 py-3 text-text">{course.teacherName}</td>
      <td className="px-4 py-3 text-sm text-muted">{course.scheduleSummary}</td>
      <td className="px-4 py-3 text-center text-text">{course.availableSeats}</td>
      <td className="px-4 py-3">
        <Badge variant={badge.variant}>{badge.label}</Badge>
      </td>
      <td className="px-4 py-3">
        {status === 'matriculado' ? (
          <ActionButton variant="secondary" onClick={onDrop}>
            Retirar
          </ActionButton>
        ) : (
          <ActionButton variant="primary" disabled={status === 'sin_cupo'} onClick={onEnroll}>
            Matricular
          </ActionButton>
        )}
      </td>
    </tr>
  )
}
