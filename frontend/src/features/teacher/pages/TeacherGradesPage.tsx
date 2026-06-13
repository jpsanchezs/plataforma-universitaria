import { useCurrentTeacher } from '@/features/teacher/hooks/useCurrentTeacher'
import { useTeacherCourseQuery } from '@/features/teacher/hooks/useTeacherCourseQuery'
import { useTeacherGrades } from '@/features/teacher/hooks/useTeacherGrades'
import { CourseSelector } from '@/features/teacher/components/CourseSelector'
import { GradeSummaryCards } from '@/features/teacher/components/GradeSummaryCards'
import { GradebookTable } from '@/features/teacher/components/GradebookTable'
import { Alert } from '@/components/feedback/Alert'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageShell } from '@/components/layout/PageShell'
import { FilterBar } from '@/components/ui/FilterBar'
import { PageHeader } from '@/components/ui/PageHeader'

export function TeacherGradesPage() {
  const { teacher } = useCurrentTeacher()

  const {
    courses,
    activeCourseId,
    students,
    rows,
    summary,
    feedback,
    selectCourse,
    resolveCourseId,
    updateGrade,
    clearFeedback,
    isCourseAllowed,
    getFieldError,
  } = useTeacherGrades(teacher?.id)

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
          title="Calificaciones no disponibles"
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
          description="No tiene cursos disponibles para registrar calificaciones."
        />
      </PageShell>
    )
  }

  return (
    <PageShell>
      <PageHeader
        title="Registro de calificaciones"
        description="Capture notas parciales y finales. La nota final se calcula automáticamente (30/30/40)."
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
      </FilterBar>

      <GradeSummaryCards summary={summary} />

      <div className="mt-6">
        {students.length === 0 ? (
          <EmptyState
            title="Sin estudiantes matriculados"
            description="Este curso no tiene estudiantes matriculados para calificar."
          />
        ) : (
          <GradebookTable
            students={students}
            rows={rows}
            onGradeChange={(studentId, field, value) =>
              updateGrade(activeCourseId, studentId, field, value)
            }
            getFieldError={getFieldError}
          />
        )}
      </div>
    </PageShell>
  )
}
