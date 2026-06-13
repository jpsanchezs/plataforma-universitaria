import { useCurrentTeacher } from '@/features/teacher/hooks/useCurrentTeacher'
import { useTeacherAttendance } from '@/features/teacher/hooks/useTeacherAttendance'
import { useTeacherCourseQuery } from '@/features/teacher/hooks/useTeacherCourseQuery'
import { AttendanceSummaryCards } from '@/features/teacher/components/AttendanceSummaryCards'
import { AttendanceTable } from '@/features/teacher/components/AttendanceTable'
import { CourseSelector } from '@/features/teacher/components/CourseSelector'
import { Alert } from '@/components/feedback/Alert'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageShell } from '@/components/layout/PageShell'
import { FilterBar } from '@/components/ui/FilterBar'
import { Input } from '@/components/ui/Input'
import { PageHeader } from '@/components/ui/PageHeader'

export function AttendancePage() {
  const { teacher } = useCurrentTeacher()

  const {
    courses,
    activeCourseId,
    selectedDate,
    rows,
    summary,
    feedback,
    selectCourse,
    selectDate,
    resolveCourseId,
    updateAttendance,
    clearFeedback,
    isCourseAllowed,
  } = useTeacherAttendance(teacher?.id)

  const { invalidCourseFromQuery, syncCourseToQuery } = useTeacherCourseQuery({
    teacherId: teacher?.id,
    coursesCount: courses.length,
    resolveCourseId,
    selectCourse,
    isCourseAllowed,
  })

  if (!teacher) {
    return (
      <PageShell>
        <EmptyState
          title="Asistencia no disponible"
          description="No se encontró un perfil docente vinculado a su usuario demo."
        />
      </PageShell>
    )
  }

  if (courses.length === 0) {
    return (
      <PageShell>
        <EmptyState
          title="Sin cursos asignados"
          description="No tiene cursos disponibles para registrar asistencia."
        />
      </PageShell>
    )
  }

  return (
    <PageShell>
      <PageHeader
        title="Registro de asistencia"
        description="Marque presentes, ausentes y justificaciones por sesión de clase."
      />

      {invalidCourseFromQuery ? (
        <Alert variant="error" className="mb-4">
          El curso solicitado no pertenece a su asignación. Se seleccionó un curso válido.
        </Alert>
      ) : null}

      {feedback ? (
        <Alert
          variant={feedback.type === 'success' ? 'success' : 'error'}
          className="mb-4"
          onDismiss={clearFeedback}
        >
          {feedback.message}
        </Alert>
      ) : null}

      <FilterBar className="mb-6">
        <CourseSelector
          courses={courses}
          value={activeCourseId}
          onChange={syncCourseToQuery}
        />
        <Input
          label="Fecha de sesión"
          type="date"
          value={selectedDate}
          onChange={(event) => selectDate(event.target.value)}
          className="sm:min-w-48"
        />
      </FilterBar>

      <AttendanceSummaryCards summary={summary} />

      <div className="mt-6">
        <AttendanceTable
          rows={rows}
          onStatusChange={(studentId, status) =>
            updateAttendance(activeCourseId, studentId, selectedDate, status)
          }
        />
      </div>
    </PageShell>
  )
}
