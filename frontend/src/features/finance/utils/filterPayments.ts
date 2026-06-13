import type { FinancePaymentViewModel, PaymentConceptFilter, PaymentStatusFilter } from '@/features/finance/types'

interface PaymentFilterOptions {
  search?: string
  status?: PaymentStatusFilter
  concept?: PaymentConceptFilter
  studentId?: string
  dateFrom?: string
  dateTo?: string
}

export function filterPaymentViewModels(
  payments: FinancePaymentViewModel[],
  options: PaymentFilterOptions,
): FinancePaymentViewModel[] {
  const query = options.search?.trim().toLowerCase() ?? ''

  return payments.filter((payment) => {
    const matchesSearch =
      query.length === 0 ||
      payment.id.toLowerCase().includes(query) ||
      payment.studentName.toLowerCase().includes(query) ||
      payment.studentCarnet.toLowerCase().includes(query) ||
      payment.description.toLowerCase().includes(query) ||
      payment.concept.toLowerCase().includes(query)

    const matchesStatus =
      !options.status || options.status === 'todos' || payment.status === options.status

    const matchesConcept =
      !options.concept || options.concept === 'todos' || payment.concept === options.concept

    const matchesStudent =
      !options.studentId || options.studentId === 'todos' || payment.studentId === options.studentId

    const matchesDateFrom = !options.dateFrom || payment.dueDate >= options.dateFrom
    const matchesDateTo = !options.dateTo || payment.dueDate <= options.dateTo

    return (
      matchesSearch &&
      matchesStatus &&
      matchesConcept &&
      matchesStudent &&
      matchesDateFrom &&
      matchesDateTo
    )
  })
}
