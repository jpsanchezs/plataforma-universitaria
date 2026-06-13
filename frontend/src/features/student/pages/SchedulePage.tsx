import { getNextScheduleBlock, getScheduleByStudentId } from '@/data/selectors'
import { useCurrentStudent } from '@/features/student/hooks/useCurrentStudent'
import { useStudentEnrollments } from '@/features/student/hooks/useStudentEnrollments'
import { WeeklySchedule } from '@/features/student/components/WeeklySchedule'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageShell } from '@/components/layout/PageShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { FiBookOpen, FiClock } from 'react-icons/fi'
import { formatNumber } from '@/utils/formatters'

export function SchedulePage() {
  const { student } = useCurrentStudent()
  const { summary, overrides } = useStudentEnrollments(student?.id)

  if (!student) {
    return (
      <PageShell>
        <EmptyState
          title="Horarios no disponibles"
          description="No se encontró un expediente estudiantil vinculado a su usuario demo."
        />
      </PageShell>
    )
  }

  const scheduleBlocks = getScheduleByStudentId(student.id, overrides)
  const nextClass = getNextScheduleBlock(student.id, overrides)

  return (
    <PageShell>
      <PageHeader
        title="Horarios"
        description="Agenda semanal de clases según su matrícula del período activo."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total de cursos"
          value={formatNumber(summary?.courseCount ?? 0)}
          icon={<FiBookOpen size={18} />}
        />
        <StatCard
          label="Total de créditos"
          value={formatNumber(summary?.totalCredits ?? 0)}
          icon={<FiBookOpen size={18} />}
        />
        <StatCard
          label="Próxima clase"
          value={nextClass ? `${nextClass.day} ${nextClass.startTime}` : 'Sin clases'}
          hint={
            nextClass
              ? `${nextClass.courseCode} — ${nextClass.courseName} · ${nextClass.room}`
              : undefined
          }
          icon={<FiClock size={18} />}
        />
      </div>

      {scheduleBlocks.length === 0 ? (
        <EmptyState
          title="Sin horarios registrados"
          description="Matricule cursos en el módulo de matrícula para ver su agenda semanal."
        />
      ) : (
        <WeeklySchedule blocks={scheduleBlocks} />
      )}
    </PageShell>
  )
}
