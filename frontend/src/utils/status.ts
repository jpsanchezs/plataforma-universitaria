import type { AttendanceStatus, EnrollmentStatus, PeriodStatus } from '@/types/academic'
import type { EntityStatus, StatusVariant } from '@/types/common'
import type { PaymentStatus } from '@/types/finance'
import type { ChangeRequestStatus, RiskLevel } from '@/types/project'

export type StatusKey =
  | EntityStatus
  | EnrollmentStatus
  | PaymentStatus
  | AttendanceStatus
  | PeriodStatus
  | RiskLevel
  | ChangeRequestStatus
  | 'aprobado'
  | 'reprobado'

const STATUS_LABELS: Record<StatusKey, string> = {
  activo: 'Activo',
  inactivo: 'Inactivo',
  graduado: 'Graduado',
  matriculado: 'Matriculado',
  retirado: 'Retirado',
  aprobado: 'Aprobado',
  reprobado: 'Reprobado',
  pagado: 'Pagado',
  pendiente: 'Pendiente',
  vencido: 'Vencido',
  presente: 'Presente',
  ausente: 'Ausente',
  justificado: 'Justificado',
  cerrado: 'Cerrado',
  planificado: 'Planificado',
  verde: 'En meta',
  amarillo: 'Atención',
  rojo: 'Crítico',
  abierta: 'Abierta',
  en_revision: 'En revisión',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
}

const STATUS_VARIANTS: Record<StatusKey, StatusVariant> = {
  activo: 'success',
  inactivo: 'default',
  graduado: 'default',
  matriculado: 'success',
  retirado: 'warning',
  aprobado: 'success',
  reprobado: 'danger',
  pagado: 'success',
  pendiente: 'warning',
  vencido: 'danger',
  presente: 'success',
  ausente: 'danger',
  justificado: 'warning',
  cerrado: 'default',
  planificado: 'warning',
  verde: 'success',
  amarillo: 'warning',
  rojo: 'danger',
  abierta: 'warning',
  en_revision: 'warning',
  aprobada: 'success',
  rechazada: 'danger',
}

export function getStatusLabel(status: StatusKey): string {
  return STATUS_LABELS[status] ?? status
}

export function getStatusVariant(status: StatusKey): StatusVariant {
  return STATUS_VARIANTS[status] ?? 'default'
}

export function isKnownStatus(status: string): status is StatusKey {
  return status in STATUS_LABELS
}
