import { useMemo } from 'react'
import {
  computeGradeDisplayStatus,
  getCourseById,
  getEffectiveCourseIds,
  getEffectiveGradeValues,
  getStudentAcademicSummary,
} from '@/data/selectors'
import { useCurrentStudent } from '@/features/student/hooks/useCurrentStudent'
import { useStudentEnrollments } from '@/features/student/hooks/useStudentEnrollments'
import { TEACHER_GRADES_STORAGE_KEY } from '@/features/teacher/constants'
import type { TeacherGradesStorage } from '@/features/teacher/types'
import { GradeStatusBadge } from '@/features/student/components/GradeStatusBadge'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageShell } from '@/components/layout/PageShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { Table, type TableColumn } from '@/components/ui/Table'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { FiAward, FiBookOpen, FiTrendingUp } from 'react-icons/fi'
import { formatGrade, formatGradeCell, formatNumber } from '@/utils/formatters'

interface GradeRow {
  id: string
  courseCode: string
  courseName: string
  partial1: number | null
  partial2: number | null
  finalExam: number | null
  finalGrade: number | null
  status: ReturnType<typeof computeGradeDisplayStatus>
}

export function GradesPage() {
  const { student } = useCurrentStudent()
  const { overrides } = useStudentEnrollments(student?.id)
  const [gradeOverrides] = useLocalStorage<TeacherGradesStorage>(
    TEACHER_GRADES_STORAGE_KEY,
    {},
  )

  const rows = useMemo<GradeRow[]>(() => {
    if (!student) {
      return []
    }
    const courseIds = getEffectiveCourseIds(student.id, overrides)
    return courseIds.map((courseId) => {
      const course = getCourseById(courseId)
      const values = getEffectiveGradeValues(student.id, courseId, gradeOverrides)
      return {
        id: courseId,
        courseCode: course?.code ?? '—',
        courseName: course?.name ?? 'Curso',
        partial1: values.partial1,
        partial2: values.partial2,
        finalExam: values.finalExam,
        finalGrade: values.finalGrade,
        status: computeGradeDisplayStatus(
          values.partial1,
          values.partial2,
          values.finalExam,
          values.finalGrade,
        ),
      }
    })
  }, [student, overrides, gradeOverrides])

  if (!student) {
    return (
      <PageShell>
        <EmptyState
          title="Calificaciones no disponibles"
          description="No se encontró un expediente estudiantil vinculado a su usuario demo."
        />
      </PageShell>
    )
  }

  const summary = getStudentAcademicSummary(student.id, overrides, undefined, gradeOverrides)

  const columns: TableColumn<GradeRow>[] = [
    { key: 'code', header: 'Código', render: (row) => row.courseCode },
    { key: 'name', header: 'Curso', render: (row) => row.courseName },
    {
      key: 'p1',
      header: 'Parcial 1',
      render: (row) => formatGradeCell(row.partial1),
      className: 'text-center',
    },
    {
      key: 'p2',
      header: 'Parcial 2',
      render: (row) => formatGradeCell(row.partial2),
      className: 'text-center',
    },
    {
      key: 'final',
      header: 'Examen final',
      render: (row) => formatGradeCell(row.finalExam),
      className: 'text-center',
    },
    {
      key: 'grade',
      header: 'Nota final',
      render: (row) => formatGradeCell(row.finalGrade),
      className: 'text-center',
    },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => <GradeStatusBadge status={row.status} />,
    },
  ]

  return (
    <PageShell>
      <PageHeader
        title="Calificaciones"
        description="Consulta de notas parciales y avance académico del período activo."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Promedio general"
          value={
            summary.averageGrade !== null ? formatGrade(summary.averageGrade) : '—'
          }
          icon={<FiTrendingUp size={18} />}
        />
        <StatCard
          label="Cursos aprobados"
          value={formatNumber(summary.approvedCourses)}
          icon={<FiAward size={18} />}
        />
        <StatCard
          label="Cursos en riesgo"
          value={formatNumber(summary.atRiskCourses)}
          icon={<FiBookOpen size={18} />}
        />
        <StatCard
          label="Mejor nota"
          value={summary.bestGrade !== null ? formatGrade(summary.bestGrade) : '—'}
          icon={<FiAward size={18} />}
        />
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="Sin calificaciones"
          description="Matricule cursos para consultar sus evaluaciones."
        />
      ) : (
        <Table columns={columns} data={rows} emptyMessage="Sin calificaciones registradas." />
      )}
    </PageShell>
  )
}
