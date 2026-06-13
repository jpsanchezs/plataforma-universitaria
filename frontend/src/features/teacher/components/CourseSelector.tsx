import type { Course } from '@/types/academic'
import { getCourseEnrollmentCount, getCourseScheduleSummary } from '@/data/selectors'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface CourseSelectorProps {
  courses: Course[]
  value: string
  onChange: (courseId: string) => void
  label?: string
}

export function CourseSelector({
  courses,
  value,
  onChange,
  label = 'Curso',
}: CourseSelectorProps) {
  return (
    <div className="min-w-56">
      <label htmlFor="course-selector" className="mb-1.5 block text-sm font-medium text-text">
        {label}
      </label>
      <select
        id="course-selector"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-primary/20 bg-card px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.code} — {course.name}
          </option>
        ))}
      </select>
    </div>
  )
}

interface TeacherCourseCardProps {
  course: Course
  onAttendance: () => void
  onGrades: () => void
}

export function TeacherCourseCard({ course, onAttendance, onGrades }: TeacherCourseCardProps) {
  const enrolledCount = getCourseEnrollmentCount(course.id)
  const scheduleSummary = getCourseScheduleSummary(course.id)

  return (
    <article className="rounded-xl border border-primary/10 bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">{course.code}</p>
          <h3 className="mt-1 text-base font-semibold text-text">{course.name}</h3>
        </div>
        <StatusBadge status={course.status} />
      </div>

      <dl className="space-y-2 text-sm text-muted">
        <div className="flex justify-between gap-2">
          <dt>Créditos</dt>
          <dd className="font-medium text-text">{course.credits}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Horario</dt>
          <dd className="text-right font-medium text-text">{scheduleSummary}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Cupo</dt>
          <dd className="font-medium text-text">
            {enrolledCount}/{course.capacity}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Aula</dt>
          <dd className="font-medium text-text">{course.room}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onAttendance}
          className="rounded-lg border border-primary/20 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5"
        >
          Registrar asistencia
        </button>
        <button
          type="button"
          onClick={onGrades}
          className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-light"
        >
          Registrar calificaciones
        </button>
      </div>
    </article>
  )
}
