import { useMemo } from 'react'
import {
  computeGradeDisplayStatus,
  getAcademicHistoryByStudentId,
  getAcademicHistorySummary,
  getCourseById,
  getCurrentAcademicPeriod,
  getEffectiveCourseIds,
  getEffectiveGradeValues,
  getPeriodById,
} from '@/data/selectors'
import { useCurrentStudent } from '@/features/student/hooks/useCurrentStudent'
import { useStudentEnrollments } from '@/features/student/hooks/useStudentEnrollments'
import { TEACHER_GRADES_STORAGE_KEY } from '@/features/teacher/constants'
import type { TeacherGradesStorage } from '@/features/teacher/types'
import { AcademicHistoryTimeline } from '@/features/student/components/AcademicHistoryTimeline'
import { GradeStatusBadge } from '@/features/student/components/GradeStatusBadge'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageShell } from '@/components/layout/PageShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { FiAward, FiBookOpen, FiTrendingUp } from 'react-icons/fi'
import { formatGpa, formatGrade, formatNumber } from '@/utils/formatters'

export function AcademicHistoryPage() {
  const { student } = useCurrentStudent()
  const { overrides } = useStudentEnrollments(student?.id)
  const [gradeOverrides] = useLocalStorage<TeacherGradesStorage>(
    TEACHER_GRADES_STORAGE_KEY,
    {},
  )

  const historySummary = useMemo(() => {
    if (!student) {
      return null
    }
    return getAcademicHistorySummary(student.id)
  }, [student])

  const currentPeriodTab = useMemo(() => {
    if (!student) {
      return null
    }
    const courseIds = getEffectiveCourseIds(student.id, overrides)

    if (courseIds.length === 0) {
      return (
        <p className="text-sm text-muted">No hay cursos matriculados en el período actual.</p>
      )
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-primary/10 text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-3 py-2">Código</th>
              <th className="px-3 py-2">Curso</th>
              <th className="px-3 py-2">Créditos</th>
              <th className="px-3 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {courseIds.map((courseId) => {
              const course = getCourseById(courseId)
              const values = getEffectiveGradeValues(student.id, courseId, gradeOverrides)
              const status = computeGradeDisplayStatus(
                values.partial1,
                values.partial2,
                values.finalExam,
                values.finalGrade,
              )
              return (
                <tr key={courseId} className="border-b border-primary/5">
                  <td className="px-3 py-3 font-medium text-text">{course?.code ?? '—'}</td>
                  <td className="px-3 py-3 text-text">{course?.name ?? 'Curso'}</td>
                  <td className="px-3 py-3 text-text">{course?.credits ?? '—'}</td>
                  <td className="px-3 py-3">
                    <GradeStatusBadge status={status} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }, [student, overrides, gradeOverrides])

  const tabItems = useMemo((): TabItem[] => {
    if (!student || !historySummary) {
      return []
    }

    const period = getCurrentAcademicPeriod()
    const historyItems = getAcademicHistoryByStudentId(student.id)
    const historicalPeriods = [...new Set(historyItems.map((item) => item.periodId))]

    const tabs: TabItem[] = []

    if (period) {
      tabs.push({
        id: period.id,
        label: `${period.name} (actual)`,
        content: currentPeriodTab,
      })
    }

    historicalPeriods.forEach((periodId) => {
      const periodData = getPeriodById(periodId)
      const items = historyItems.filter((item) => item.periodId === periodId)
      tabs.push({
        id: periodId,
        label: periodData?.name ?? periodId,
        content: <AcademicHistoryTimeline items={items} />,
      })
    })

    return tabs
  }, [student, historySummary, currentPeriodTab])

  if (!student || !historySummary) {
    return (
      <PageShell>
        <EmptyState
          title="Historial no disponible"
          description="No se encontró un expediente estudiantil vinculado a su usuario demo."
        />
      </PageShell>
    )
  }

  return (
    <PageShell>
      <PageHeader
        title="Historial académico"
        description="Registro de cursos cursados, créditos obtenidos y desempeño por período."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Créditos aprobados"
          value={formatNumber(historySummary.approvedCredits)}
          icon={<FiBookOpen size={18} />}
        />
        <StatCard
          label="Promedio histórico"
          value={
            historySummary.averageGrade !== null
              ? formatGrade(historySummary.averageGrade)
              : formatGpa(student.gpa)
          }
          icon={<FiTrendingUp size={18} />}
        />
        <StatCard
          label="Cursos aprobados"
          value={formatNumber(historySummary.approvedCount)}
          icon={<FiAward size={18} />}
        />
        <StatCard
          label="Cursos reprobados"
          value={formatNumber(historySummary.failedCount)}
          icon={<FiBookOpen size={18} />}
        />
      </div>

      {tabItems.length === 0 ? (
        <EmptyState
          title="Sin historial registrado"
          description="Aún no hay cursos históricos asociados a su expediente."
        />
      ) : (
        <Tabs items={tabItems} defaultTabId={tabItems[0]?.id} />
      )}
    </PageShell>
  )
}
