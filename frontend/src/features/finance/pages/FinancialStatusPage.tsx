import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useFinancePayments } from '@/features/finance/hooks/useFinancePayments'
import {
  resolveFinanceStudentId,
  useStudentFinancialStatus,
} from '@/features/finance/hooks/useStudentFinancialStatus'
import { PaymentDetailModal } from '@/features/finance/components/PaymentDetailModal'
import { PaymentsTable } from '@/features/finance/components/PaymentsTable'
import { ReceiptModal } from '@/features/finance/components/ReceiptModal'
import { StudentFinancialCard } from '@/features/finance/components/StudentFinancialCard'
import { PAYMENT_CONCEPT_LABELS } from '@/features/finance/constants'
import type { FinancePaymentViewModel } from '@/features/finance/types'
import { Alert } from '@/components/feedback/Alert'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageShell } from '@/components/layout/PageShell'
import { FilterBar } from '@/components/ui/FilterBar'
import { PageHeader } from '@/components/ui/PageHeader'
import { Select } from '@/components/ui/Select'
import { formatCurrencyCRC } from '@/utils/formatters'

export function FinancialStatusPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryStudentId = searchParams.get('studentId')
  const [manualStudentId, setManualStudentId] = useState('')

  const {
    feedback,
    markAsPaid,
    generateReceipt,
    getReceipt,
    clearFeedback,
  } = useFinancePayments()

  const { students } = useStudentFinancialStatus('')
  const activeStudentId = useMemo(() => {
    if (manualStudentId) {
      return resolveFinanceStudentId(manualStudentId, students)
    }
    return resolveFinanceStudentId(queryStudentId, students)
  }, [manualStudentId, queryStudentId, students])

  const {
    student,
    payments,
    accountSummary,
    conceptTotals,
    nextDuePayment,
  } = useStudentFinancialStatus(activeStudentId)

  const [selectedPayment, setSelectedPayment] = useState<FinancePaymentViewModel | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [activeReceipt, setActiveReceipt] = useState(
    null as ReturnType<typeof getReceipt> | null,
  )

  const invalidStudentFromQuery = Boolean(
    queryStudentId && !students.some((item) => item.id === queryStudentId),
  )

  const handleSelectStudent = (studentId: string) => {
    setManualStudentId(studentId)
    setSearchParams({ studentId }, { replace: true })
  }

  const openReceipt = (payment: FinancePaymentViewModel) => {
    const existing = getReceipt(payment.id)
    const receipt = existing ?? generateReceipt(payment.id)
    if (receipt) {
      setActiveReceipt(receipt)
      setReceiptOpen(true)
    }
  }

  if (students.length === 0) {
    return (
      <PageShell>
        <EmptyState
          title="Sin estudiantes con pagos"
          description="No hay estudiantes con cargos financieros registrados en el sistema."
        />
      </PageShell>
    )
  }

  return (
    <PageShell>
      <PageHeader
        title="Estado financiero del estudiante"
        description="Consulte saldos, morosidad y proyección de pagos por estudiante."
      />

      {invalidStudentFromQuery ? (
        <Alert variant="error" className="mb-4">
          El estudiante solicitado no tiene pagos registrados. Se seleccionó un perfil válido.
        </Alert>
      ) : null}

      {feedback ? (
        <Alert
          variant={feedback.type === 'success' ? 'success' : 'error'}
          className="mb-4"
          onDismiss={clearFeedback}
        >
          {feedback.message}
        </Alert>
      ) : null}

      <FilterBar className="mb-6">
        <Select
          label="Estudiante"
          value={activeStudentId}
          onChange={(event) => handleSelectStudent(event.target.value)}
          options={students.map((item) => ({
            value: item.id,
            label: `${item.carnet} — ${item.fullName}`,
          }))}
          className="min-w-72"
        />
      </FilterBar>

      {student && accountSummary && conceptTotals ? (
        <>
          <StudentFinancialCard
            student={student}
            summary={accountSummary}
            nextDueDate={nextDuePayment?.dueDate ?? null}
          />

          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {(Object.keys(conceptTotals) as Array<keyof typeof conceptTotals>).map((concept) => (
              <article
                key={concept}
                className="rounded-xl border border-primary/10 bg-card p-4"
              >
                <p className="text-xs uppercase tracking-wide text-muted">
                  {PAYMENT_CONCEPT_LABELS[concept]}
                </p>
                <p className="mt-2 text-lg font-semibold text-text">
                  {formatCurrencyCRC(conceptTotals[concept])}
                </p>
              </article>
            ))}
          </div>

          <PaymentsTable
            payments={payments}
            onView={(payment) => {
              setSelectedPayment(payment)
              setDetailOpen(true)
            }}
            onMarkPaid={(payment) => markAsPaid(payment.id)}
            onGenerateReceipt={openReceipt}
          />
        </>
      ) : (
        <EmptyState
          title="Estudiante no disponible"
          description="Seleccione un estudiante con pagos registrados."
        />
      )}

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
