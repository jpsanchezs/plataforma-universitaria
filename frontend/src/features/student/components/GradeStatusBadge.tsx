import { Badge } from '@/components/ui/Badge'
import type { GradeDisplayStatus } from '@/features/student/types'

interface GradeStatusBadgeProps {
  status: GradeDisplayStatus
}

const config: Record<
  GradeDisplayStatus,
  { label: string; variant: 'default' | 'success' | 'warning' | 'danger' }
> = {
  aprobado: { label: 'Aprobado', variant: 'success' },
  reprobado: { label: 'Reprobado', variant: 'danger' },
  en_curso: { label: 'En curso', variant: 'warning' },
  pendiente: { label: 'Pendiente', variant: 'default' },
}

export function GradeStatusBadge({ status }: GradeStatusBadgeProps) {
  const item = config[status]
  return <Badge variant={item.variant}>{item.label}</Badge>
}
