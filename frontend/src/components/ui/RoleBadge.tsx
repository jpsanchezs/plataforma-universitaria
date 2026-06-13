import type { Role } from '@/types/auth'
import { Badge } from '@/components/ui/Badge'
import { ROLE_LABELS } from '@/utils/permissions'

interface RoleBadgeProps {
  role: Role
}

const roleVariantMap: Record<
  Role,
  'default' | 'success' | 'warning' | 'danger'
> = {
  estudiante: 'default',
  docente: 'success',
  administrativo: 'warning',
  financiero: 'default',
  ejecutivo: 'danger',
  'director-proyecto': 'warning',
}

export function RoleBadge({ role }: RoleBadgeProps) {
  return <Badge variant={roleVariantMap[role]}>{ROLE_LABELS[role]}</Badge>
}
