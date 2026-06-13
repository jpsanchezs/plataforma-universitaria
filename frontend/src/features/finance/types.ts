import type { Payment, PaymentConcept, PaymentStatus } from '@/types/finance'
import type { Currency, ID, ISODateString } from '@/types/common'

export interface FinancePaymentsStorage {
  updated: Record<ID, Partial<Payment>>
  generatedReceipts: Record<ID, ReceiptInfo>
}

export interface ReceiptInfo {
  receiptNumber: string
  issuedAt: ISODateString
  paymentId: ID
  studentName: string
  studentCarnet: string
  concept: PaymentConcept
  description: string
  amount: number
  currency: Currency
  paidDate: ISODateString
}

export interface FinancePaymentViewModel extends Payment {
  studentName: string
  studentCarnet: string
}

export interface FinanceSummary {
  totalBilled: number
  totalPaid: number
  totalPending: number
  totalOverdue: number
  overdueCount: number
}

export interface PaymentHistorySummary {
  transactionCount: number
  totalPaid: number
  totalPending: number
  totalOverdue: number
}

export interface PaymentConceptTotals {
  matricula: number
  curso: number
  multa: number
  otro: number
}

export type PaymentStatusFilter = 'todos' | PaymentStatus

export type PaymentConceptFilter = 'todos' | PaymentConcept

export interface FinanceFeedback {
  type: 'success' | 'error'
  message: string
}

export interface PaymentActionResult {
  success: boolean
  message: string
}

export function emptyFinancePaymentsStorage(): FinancePaymentsStorage {
  return { updated: {}, generatedReceipts: {} }
}
