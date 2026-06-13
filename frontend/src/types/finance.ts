import type { Currency, ID, ISODateString } from '@/types/common'

export type PaymentStatus = 'pagado' | 'pendiente' | 'vencido'

export type PaymentConcept = 'matricula' | 'curso' | 'multa' | 'otro'

export interface Payment {
  id: ID
  studentId: ID
  concept: PaymentConcept
  description: string
  amount: number
  currency: Currency
  status: PaymentStatus
  dueDate: ISODateString
  paidDate: ISODateString | null
  periodId: ID
}

export interface AccountSummary {
  studentId: ID
  balance: number
  totalPaid: number
  totalPending: number
  overdueAmount: number
  currency: Currency
}

export interface FinancialKpi {
  label: string
  value: number | string
  unit?: string
}

export interface AcademicKpi {
  label: string
  value: number | string
  unit?: string
}
