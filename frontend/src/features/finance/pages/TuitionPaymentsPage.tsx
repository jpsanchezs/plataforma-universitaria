import { useMemo, useState } from 'react'
import { getTuitionPaymentsSummary } from '@/data/selectors'
import { useFinancePayments } from '@/features/finance/hooks/useFinancePayments'
import { FinanceSummaryCards } from '@/features/finance/components/FinanceSummaryCards'
import { financeSummaryToCards } from '@/features/finance/utils/summaryCards'
import { PaymentDetailModal } from '@/features/finance/components/PaymentDetailModal'
import { PaymentFilters } from '@/features/finance/components/PaymentFilters'
import { PaymentsTable } from '@/features/finance/components/PaymentsTable'
import { ReceiptModal } from '@/features/finance/components/ReceiptModal'
import type { FinancePaymentViewModel, PaymentStatusFilter } from '@/features/finance/types'
import { filterPaymentViewModels } from '@/features/finance/utils/filterPayments'
import { Alert } from '@/components/feedback/Alert'
import { PageShell } from '@/components/layout/PageShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { FiAlertCircle, FiCheckCircle, FiClock, FiCreditCard } from 'react-icons/fi'

export function TuitionPaymentsPage() {
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
  const [selectedPayment, setSelectedPayment] = useState<FinancePaymentViewModel | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [activeReceipt, setActiveReceipt] = useState(
    null as ReturnType<typeof getReceipt> | null,
  )

  const tuitionPayments = useMemo(
    () => payments.filter((payment) => payment.concept === 'matricula'),
    [payments],
  )

  const filteredPayments = useMemo(
    () => filterPaymentViewModels(tuitionPayments, { search, status: statusFilter }),
    [tuitionPayments, search, statusFilter],
  )

  const summary = useMemo(() => getTuitionPaymentsSummary(storage), [storage])
  const summaryCards = financeSummaryToCards(summary).map((item, index) => ({
    ...item,
    icon: [<FiCreditCard size={18} />, <FiCheckCircle size={18} />, <FiClock size={18} />, <FiAlertCircle size={18} />][index],
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
        title="Pagos de matrícula"
        description="Registre, concilie y genere comprobantes simulados de matrícula por estudiante."
      />

      <Alert variant="info" className="mb-4">
        Los cambios se guardan en localStorage y se reflejan en el estado de cuenta del estudiante.
        No se procesan transacciones reales ni datos de tarjeta.
      </Alert>

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
        searchPlaceholder="Buscar por estudiante, carnet o ID de pago"
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
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
