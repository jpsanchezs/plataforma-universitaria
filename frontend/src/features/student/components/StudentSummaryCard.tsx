import type { Student } from '@/types/academic'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface StudentSummaryCardProps {
  student: Student
}

export function StudentSummaryCard({ student }: StudentSummaryCardProps) {
  return (
    <article className="rounded-xl border border-primary/10 bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-muted">Estudiante UTLM</p>
          <h2 className="mt-1 text-2xl font-bold text-primary">{student.fullName}</h2>
          <p className="mt-1 text-sm text-muted">Carnet: {student.carnet}</p>
        </div>
        <StatusBadge status={student.status} />
      </div>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">Carrera</dt>
          <dd className="mt-1 text-sm font-medium text-text">{student.career}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">Semestre</dt>
          <dd className="mt-1 text-sm font-medium text-text">{student.semester}°</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">GPA</dt>
          <dd className="mt-1 text-sm font-medium text-text">{student.gpa.toFixed(2)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">Sede</dt>
          <dd className="mt-1 text-sm font-medium text-text">{student.campus}</dd>
        </div>
      </dl>
    </article>
  )
}
