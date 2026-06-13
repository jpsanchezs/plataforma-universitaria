import { useNavigate } from 'react-router-dom'
import { getCourseTeacherSummary, getCoursesByTeacherId } from '@/data/selectors'
import { useCurrentTeacher } from '@/features/teacher/hooks/useCurrentTeacher'
import { TeacherCourseCard } from '@/features/teacher/components/CourseSelector'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageShell } from '@/components/layout/PageShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { ROUTES } from '@/utils/routes'
import { FiBookOpen, FiCalendar, FiUsers } from 'react-icons/fi'
import { formatNumber } from '@/utils/formatters'

export function TeacherCoursesPage() {
  const navigate = useNavigate()
  const { teacher } = useCurrentTeacher()

  if (!teacher) {
    return (
      <PageShell>
        <EmptyState
          title="Cursos no disponibles"
          description="No se encontró un perfil docente vinculado a su usuario demo."
        />
      </PageShell>
    )
  }

  const courses = getCoursesByTeacherId(teacher.id)
  const summary = getCourseTeacherSummary(teacher.id)

  return (
    <PageShell>
      <PageHeader
        title="Mis cursos"
        description={`Cursos asignados a ${teacher.fullName} para el período académico activo.`}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Cursos asignados"
          value={formatNumber(summary.courseCount)}
          icon={<FiBookOpen size={18} />}
        />
        <StatCard
          label="Estudiantes matriculados"
          value={formatNumber(summary.totalStudents)}
          icon={<FiUsers size={18} />}
        />
        <StatCard
          label="Créditos impartidos"
          value={formatNumber(summary.totalCredits)}
          icon={<FiBookOpen size={18} />}
        />
        <StatCard
          label="Período académico"
          value={summary.period?.name ?? '—'}
          hint={summary.period?.status}
          icon={<FiCalendar size={18} />}
        />
      </div>

      {courses.length === 0 ? (
        <EmptyState
          title="Sin cursos asignados"
          description="No hay cursos registrados para este docente en el período actual."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {courses.map((course) => (
            <TeacherCourseCard
              key={course.id}
              course={course}
              onAttendance={() =>
                navigate(`${ROUTES.TEACHER.ATTENDANCE}?courseId=${course.id}`)
              }
              onGrades={() =>
                navigate(`${ROUTES.TEACHER.GRADES}?courseId=${course.id}`)
              }
            />
          ))}
        </div>
      )}
    </PageShell>
  )
}
