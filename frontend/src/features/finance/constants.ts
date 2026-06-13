import type { PaymentConcept } from '@/types/finance'

export { FINANCE_PAYMENTS_STORAGE_KEY } from '@/utils/storageKeys'

export const PAYMENT_STATUS_FILTER_OPTIONS = [
  { value: 'todos', label: 'Todos' },
  { value: 'pagado', label: 'Pagado' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'vencido', label: 'Vencido' },
] as const

export const PAYMENT_CONCEPT_FILTER_OPTIONS = [
  { value: 'todos', label: 'Todos' },
  { value: 'matricula', label: 'Matrícula' },
  { value: 'curso', label: 'Curso' },
  { value: 'multa', label: 'Multa' },
  { value: 'otro', label: 'Otro' },
] as const

export const PAYMENT_CONCEPT_LABELS: Record<PaymentConcept, string> = {
  matricula: 'Matrícula',
  curso: 'Curso',
  multa: 'Multa',
  otro: 'Otro',
}
