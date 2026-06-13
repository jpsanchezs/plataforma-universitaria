import type { RiskLevel } from '@/types/project'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface RiskLevelBadgeProps {
  level: RiskLevel
}

export function RiskLevelBadge({ level }: RiskLevelBadgeProps) {
  return <StatusBadge status={level} />
}
