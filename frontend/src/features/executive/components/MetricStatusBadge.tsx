import type { RiskLevel } from '@/types/project'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface MetricStatusBadgeProps {
  status: RiskLevel
}

export function MetricStatusBadge({ status }: MetricStatusBadgeProps) {
  return <StatusBadge status={status} />
}
