import { useMemo, useState } from 'react'
import { getPaymentHistorySummary, getStudentsWithPayments } from '@/data/selectors'
import { useFinancePayments } from '@/features/finance/hooks/useFinancePayments'
import { FinanceSummaryCards } from '@/features/finance/components/FinanceSummaryCards'
import { historySummaryToCards } from '@/features/finance/utils/summaryCards'
import { PaymentDetailModal } from '@/features/finance/components/PaymentDetailModal'
import { PaymentFilters } from '@/features/finance/components/PaymentFilters'
import { PaymentsTable } from '@/features/finance/components/PaymentsTable'
import { ReceiptModal } from '@/features/finance/components/ReceiptModal'
import type {
  FinancePaymentViewModel,
  PaymentConceptFilter,
  PaymentStatusFilter,
} from '@/features/finance/types'
import { filterPaymentViewModels } from '@/features/finance/utils/filterPayments'
import { Alert } from '@/components/feedback/Alert'
import { PageShell } from '@/components/layout/PageShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { FiArchive, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi'

export function PaymentHistoryPage() {
  const {
    storage,
    payments,
    feedback,
    markAsPaid,
    generateReceipt,
    getReceipt,
    clearFeedback,
  } = useFinancePayments()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>('todos')
  const [conceptFilter, setConceptFilter] = useState<PaymentConceptFilter>('todos')
  const [studentFilter, setStudentFilter] = useState('todos')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedPayment, setSelectedPayment] = useState<FinancePaymentViewModel | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [activeReceipt, setActiveReceipt] = useState(
    null as ReturnType<typeof getReceipt> | null,
  )

  const studentOptions = useMemo(() => {
    const students = getStudentsWithPayments(storage)
    return [
      { value: 'todos', label: 'Todos' },
      ...students.map((student) => ({
        value: student.id,
        label: `${student.carnet} — ${student.fullName}`,
      })),
    ]
  }, [storage])

  const filteredPayments = useMemo(
    () =>
      filterPaymentViewModels(payments, {
        search,
        status: statusFilter,
        concept: conceptFilter,
        studentId: studentFilter,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      }),
    [payments, search, statusFilter, conceptFilter, studentFilter, dateFrom, dateTo],
  )

  const summary = useMemo(() => getPaymentHistorySummary(storage), [storage])
  const summaryCards = historySummaryToCards(summary).map((item, index) => ({
    ...item,
    icon: [<FiArchive size={18} />, <FiCheckCircle size={18} />, <FiClock size={18} />, <FiAlertCircle size={18} />][index],
  }))

  const openReceipt = (payment: FinancePaymentViewModel) => {
    const existing = getReceipt(payment.id)
    const receipt = existing ?? generateReceipt(payment.id)
    if (receipt) {
      setActiveReceipt(receipt)
      setReceiptOpen(true)
    }
  }

  return (
    <PageShell>
      <PageHeader
        title="Historial de pagos"
        description="Consulta transacciones simuladas, estados y comprobantes emitidos."
      />

      {feedback ? (
        <Alert
          variant={feedback.type === 'success' ? 'success' : 'error'}
          className="mb-4"
          onDismiss={clearFeedback}
        >
          {feedback.message}
        </Alert>
      ) : null}

      <FinanceSummaryCards items={summaryCards} />

      <PaymentFilters
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar en todo el historial"
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        conceptFilter={conceptFilter}
        onConceptFilterChange={setConceptFilter}
        studentFilter={studentFilter}
        onStudentFilterChange={setStudentFilter}
        studentOptions={studentOptions}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />

      <PaymentsTable
        payments={filteredPayments}
        onView={(payment) => {
          setSelectedPayment(payment)
          setDetailOpen(true)
        }}
        onMarkPaid={(payment) => markAsPaid(payment.id)}
        onGenerateReceipt={openReceipt}
      />

      <PaymentDetailModal
        open={detailOpen}
        payment={selectedPayment}
        onClose={() => setDetailOpen(false)}
      />

      <ReceiptModal
        open={receiptOpen}
        receipt={activeReceipt}
        onClose={() => setReceiptOpen(false)}
      />
    </PageShell>
  )
}
