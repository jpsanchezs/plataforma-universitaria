import type { AttendanceSummary } from '@/features/teacher/types'
import { StatCard } from '@/components/ui/StatCard'
import { FiCheckCircle, FiClock, FiUsers, FiXCircle } from 'react-icons/fi'
import { formatNumber, formatPercentage } from '@/utils/formatters'

interface AttendanceSummaryCardsProps {
  summary: AttendanceSummary
}

export function AttendanceSummaryCards({ summary }: AttendanceSummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard
        label="Total estudiantes"
        value={formatNumber(summary.total)}
        icon={<FiUsers size={18} />}
      />
      <StatCard
        label="Presentes"
        value={formatNumber(summary.present)}
        icon={<FiCheckCircle size={18} />}
      />
      <StatCard
        label="Ausentes"
        value={formatNumber(summary.absent)}
        icon={<FiXCircle size={18} />}
      />
      <StatCard
        label="Justificados"
        value={formatNumber(summary.justified)}
        icon={<FiClock size={18} />}
      />
      <StatCard
        label="Asistencia"
        value={formatPercentage(summary.attendanceRate)}
        icon={<FiCheckCircle size={18} />}
      />
    </div>
  )
}
