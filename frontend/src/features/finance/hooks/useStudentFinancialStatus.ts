import { useMemo } from 'react'
import type { ID } from '@/types/common'
import {
  getAccountSummaryByStudentId,
  getNextDuePayment,
  getPaymentConceptTotals,
  getPaymentsByStudentId,
  getStudentById,
  getStudentsWithPayments,
  toFinancePaymentViewModel,
} from '@/data/selectors'
import { useFinancePaymentStorage } from '@/features/finance/hooks/useFinancePaymentStorage'

export function useStudentFinancialStatus(activeStudentId: ID) {
  const [storage] = useFinancePaymentStorage()

  const students = useMemo(() => getStudentsWithPayments(storage), [storage])
  const student = activeStudentId ? getStudentById(activeStudentId) : undefined

  const payments = useMemo(() => {
    if (!activeStudentId) {
      return []
    }
    return getPaymentsByStudentId(activeStudentId, storage).map(toFinancePaymentViewModel)
  }, [activeStudentId, storage])

  const accountSummary = useMemo(() => {
    if (!activeStudentId) {
      return null
    }
    return getAccountSummaryByStudentId(activeStudentId, storage)
  }, [activeStudentId, storage])

  const conceptTotals = useMemo(() => {
    if (!activeStudentId) {
      return null
    }
    return getPaymentConceptTotals(activeStudentId, storage)
  }, [activeStudentId, storage])

  const nextDuePayment = useMemo(() => {
    if (!activeStudentId) {
      return null
    }
    return getNextDuePayment(activeStudentId, storage)
  }, [activeStudentId, storage])

  return {
    storage,
    students,
    student,
    payments,
    accountSummary,
    conceptTotals,
    nextDuePayment,
  }
}

export function resolveFinanceStudentId(
  requestedStudentId: ID | null,
  students: ReturnType<typeof getStudentsWithPayments>,
): ID {
  if (requestedStudentId && students.some((student) => student.id === requestedStudentId)) {
    return requestedStudentId
  }
  return students[0]?.id ?? ''
}
