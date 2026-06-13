import { Badge } from '@/components/ui/Badge'
import { getStatusLabel, getStatusVariant, isKnownStatus } from '@/utils/status'
import type { StatusKey } from '@/utils/status'

interface StatusBadgeProps {
  status: StatusKey | string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (!isKnownStatus(status)) {
    return <Badge variant="default">{status}</Badge>
  }

  return <Badge variant={getStatusVariant(status)}>{getStatusLabel(status)}</Badge>
}
