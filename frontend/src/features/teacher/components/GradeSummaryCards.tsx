import type { GradeSummary } from '@/features/teacher/types'
import { StatCard } from '@/components/ui/StatCard'
import { FiAward, FiBookOpen, FiTrendingUp, FiXCircle } from 'react-icons/fi'
import { formatGrade, formatNumber } from '@/utils/formatters'

interface GradeSummaryCardsProps {
  summary: GradeSummary
}

export function GradeSummaryCards({ summary }: GradeSummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Promedio del curso"
        value={summary.average !== null ? formatGrade(summary.average) : '—'}
        icon={<FiTrendingUp size={18} />}
      />
      <StatCard
        label="Aprobados"
        value={formatNumber(summary.approved)}
        icon={<FiAward size={18} />}
      />
      <StatCard
        label="Reprobados"
        value={formatNumber(summary.failed)}
        icon={<FiXCircle size={18} />}
      />
      <StatCard
        label="En curso / pendientes"
        value={formatNumber(summary.inProgress)}
        icon={<FiBookOpen size={18} />}
      />
    </div>
  )
}
