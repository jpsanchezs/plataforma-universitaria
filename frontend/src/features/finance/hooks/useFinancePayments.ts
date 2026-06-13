import { useCallback, useMemo, useState } from 'react'
import type { Payment } from '@/types/finance'
import type { ID } from '@/types/common'
import {
  getEffectivePaymentById,
  getFinancePaymentViewModels,
} from '@/data/selectors'
import { useFinancePaymentStorage } from '@/features/finance/hooks/useFinancePaymentStorage'
import type {
  FinanceFeedback,
  FinancePaymentsStorage,
  ReceiptInfo,
} from '@/features/finance/types'

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10)
}

function applyPaymentPatch(
  storage: FinancePaymentsStorage,
  paymentId: ID,
  patch: Partial<Payment>,
): FinancePaymentsStorage {
  return {
    ...storage,
    updated: {
      ...storage.updated,
      [paymentId]: { ...storage.updated[paymentId], ...patch },
    },
  }
}

export function useFinancePayments() {
  const [storage, setStorage] = useFinancePaymentStorage()
  const [feedback, setFeedback] = useState<FinanceFeedback | null>(null)

  const payments = useMemo(() => getFinancePaymentViewModels(storage), [storage])

  const getReceipt = useCallback(
    (paymentId: ID) => storage.generatedReceipts[paymentId],
    [storage.generatedReceipts],
  )

  const markAsPaid = useCallback(
    (paymentId: ID): boolean => {
      const payment = getEffectivePaymentById(paymentId, storage)
      if (!payment) {
        setFeedback({ type: 'error', message: 'Pago no encontrado.' })
        return false
      }
      if (payment.status === 'pagado') {
        setFeedback({ type: 'error', message: 'El pago ya está marcado como pagado.' })
        return false
      }

      setStorage((current) =>
        applyPaymentPatch(current, paymentId, {
          status: 'pagado',
          paidDate: todayIsoDate(),
        }),
      )
      setFeedback({ type: 'success', message: 'Pago marcado como pagado correctamente.' })
      return true
    },
    [setStorage, storage],
  )

  const markAsPending = useCallback(
    (paymentId: ID): boolean => {
      const payment = getEffectivePaymentById(paymentId, storage)
      if (!payment) {
        setFeedback({ type: 'error', message: 'Pago no encontrado.' })
        return false
      }

      setStorage((current) =>
        applyPaymentPatch(current, paymentId, {
          status: 'pendiente',
          paidDate: null,
        }),
      )
      setFeedback({ type: 'success', message: 'Pago marcado como pendiente.' })
      return true
    },
    [setStorage, storage],
  )

  const markAsOverdue = useCallback(
    (paymentId: ID): boolean => {
      const payment = getEffectivePaymentById(paymentId, storage)
      if (!payment) {
        setFeedback({ type: 'error', message: 'Pago no encontrado.' })
        return false
      }

      setStorage((current) =>
        applyPaymentPatch(current, paymentId, {
          status: 'vencido',
          paidDate: null,
        }),
      )
      setFeedback({ type: 'success', message: 'Pago marcado como vencido.' })
      return true
    },
    [setStorage, storage],
  )

  const updatePaymentStatus = useCallback(
    (paymentId: ID, status: Payment['status']): boolean => {
      if (status === 'pagado') {
        return markAsPaid(paymentId)
      }
      if (status === 'pendiente') {
        return markAsPending(paymentId)
      }
      return markAsOverdue(paymentId)
    },
    [markAsOverdue, markAsPaid, markAsPending],
  )

  const generateReceipt = useCallback(
    (paymentId: ID): ReceiptInfo | null => {
      const payment = payments.find((item) => item.id === paymentId)
      if (!payment) {
        setFeedback({ type: 'error', message: 'Pago no encontrado.' })
        return null
      }
      if (payment.status !== 'pagado') {
        setFeedback({
          type: 'error',
          message: 'Solo se puede generar comprobante para pagos marcados como pagados.',
        })
        return null
      }
      if (!payment.paidDate) {
        setFeedback({ type: 'error', message: 'El pago no tiene fecha de pago registrada.' })
        return null
      }

      const receipt: ReceiptInfo = {
        receiptNumber: `REC-${payment.id}-${Date.now().toString().slice(-6)}`,
        issuedAt: todayIsoDate(),
        paymentId: payment.id,
        studentName: payment.studentName,
        studentCarnet: payment.studentCarnet,
        concept: payment.concept,
        description: payment.description,
        amount: payment.amount,
        currency: payment.currency,
        paidDate: payment.paidDate,
      }

      setStorage((current) => ({
        ...current,
        generatedReceipts: {
          ...current.generatedReceipts,
          [paymentId]: receipt,
        },
      }))
      setFeedback({ type: 'success', message: 'Comprobante generado correctamente.' })
      return receipt
    },
    [payments, setStorage],
  )

  const clearFeedback = useCallback(() => setFeedback(null), [])

  return {
    storage,
    payments,
    feedback,
    markAsPaid,
    markAsPending,
    markAsOverdue,
    updatePaymentStatus,
    generateReceipt,
    getReceipt,
    clearFeedback,
  }
}
