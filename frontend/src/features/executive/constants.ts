import type { KpiCategory } from '@/types/project'
import type { PaymentConcept } from '@/types/finance'

export const EXECUTIVE_CHART_COLORS = {
  primary: '#1e3a5f',
  accent: '#c9a227',
  success: '#15803d',
  warning: '#ca8a04',
  danger: '#b91c1c',
  muted: '#64748b',
  pie: ['#1e3a5f', '#2e5a8c', '#c9a227', '#64748b'],
} as const

export const PAYMENT_CONCEPT_LABELS: Record<PaymentConcept, string> = {
  matricula: 'Matrícula',
  curso: 'Curso',
  multa: 'Multa',
  otro: 'Otro',
}

export const KPI_CATEGORY_LABELS: Record<KpiCategory, string> = {
  tiempo: 'Tiempo',
  costo: 'Costo',
  calidad: 'Calidad',
  productividad: 'Productividad',
}

export const PROJECT_HEALTH_LABELS: Record<KpiCategory | 'riesgos', string> = {
  tiempo: 'Tiempo',
  costo: 'Costo',
  calidad: 'Calidad',
  productividad: 'Productividad',
  riesgos: 'Riesgos',
}
