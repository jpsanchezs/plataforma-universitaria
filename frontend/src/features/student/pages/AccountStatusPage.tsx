import { useMemo, useState } from 'react'
import { getPaymentsByStudentId, getStudentFinancialSummary } from '@/data/selectors'
import type { Payment } from '@/types/finance'
import { useCurrentStudent } from '@/features/student/hooks/useCurrentStudent'
import { useFinancePaymentStorage } from '@/features/finance/hooks/useFinancePaymentStorage'
import type { PaymentFilter } from '@/features/student/types'
import { AccountSummaryCard } from '@/features/student/components/AccountSummaryCard'
import { Alert } from '@/components/feedback/Alert'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageShell } from '@/components/layout/PageShell'
import { ActionButton } from '@/components/ui/ActionButton'
import { FilterBar } from '@/components/ui/FilterBar'
import { PageHeader } from '@/components/ui/PageHeader'
import { Select } from '@/components/ui/Select'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Table, type TableColumn } from '@/components/ui/Table'
import type { PaymentConcept } from '@/types/finance'
import { formatCurrencyCRC, formatDate, formatShortDate } from '@/utils/formatters'

const conceptLabels: Record<PaymentConcept, string> = {
  matricula: 'Matrícula',
  curso: 'Curso',
  multa: 'Multa',
  otro: 'Otro',
}

const filterOptions = [
  { value: 'todos', label: 'Todos' },
  { value: 'pagado', label: 'Pagado' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'vencido', label: 'Vencido' },
]

export function AccountStatusPage() {
  const { student } = useCurrentStudent()
  const [paymentStorage] = useFinancePaymentStorage()
  const [filter, setFilter] = useState<PaymentFilter>('todos')

  const payments = useMemo(() => {
    if (!student) {
      return []
    }
    return getPaymentsByStudentId(student.id, paymentStorage)
  }, [student, paymentStorage])

  const filteredPayments = useMemo(() => {
    if (filter === 'todos') {
      return payments
    }
    return payments.filter((payment) => payment.status === filter)
  }, [payments, filter])

  if (!student) {
    return (
      <PageShell>
        <EmptyState
          title="Estado de cuenta no disponible"
          description="No se encontró un expediente estudiantil vinculado a su usuario demo."
        />
      </PageShell>
    )
  }

  const financialSummary = getStudentFinancialSummary(student.id, paymentStorage)

  const columns: TableColumn<Payment>[] = [
    {
      key: 'concept',
      header: 'Concepto',
      render: (row) => (
        <div>
          <p className="font-medium text-text">{row.description}</p>
          <p className="text-xs text-muted">{conceptLabels[row.concept]}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Monto',
      render: (row) => formatCurrencyCRC(row.amount),
      className: 'font-medium',
    },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'due',
      header: 'Vencimiento',
      render: (row) => formatShortDate(row.dueDate),
    },
    {
      key: 'paid',
      header: 'Fecha de pago',
      render: (row) => (row.paidDate ? formatShortDate(row.paidDate) : '—'),
    },
    {
      key: 'action',
      header: 'Acción',
      render: () => (
        <ActionButton variant="secondary" disabled>
          Ver detalle
        </ActionButton>
      ),
    },
  ]

  return (
    <PageShell>
      <PageHeader
        title="Estado de cuenta"
        description="Consulta de cargos, pagos y saldos del período activo."
      />

      <Alert variant="info" className="mb-6">
        Los pagos mostrados son simulados para el prototipo. No se procesan transacciones reales.
      </Alert>

      <AccountSummaryCard summary={financialSummary} />

      <FilterBar className="my-6">
        <Select
          label="Filtrar por estado"
          className="sm:min-w-48"
          value={filter}
          options={filterOptions}
          onChange={(event) => setFilter(event.target.value as PaymentFilter)}
        />
        <ActionButton variant="secondary" disabled className="self-end">
          Generar comprobante
        </ActionButton>
      </FilterBar>

      <Table
        columns={columns}
        data={filteredPayments}
        emptyMessage="No hay cargos con el filtro seleccionado."
      />

      {financialSummary.nextDueDate ? (
        <p className="mt-4 text-sm text-muted">
          Próximo vencimiento: {formatDate(financialSummary.nextDueDate)}
        </p>
      ) : null}
    </PageShell>
  )
}
