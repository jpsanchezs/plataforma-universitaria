import type { FinancePaymentViewModel } from '@/features/finance/types'
import { PAYMENT_CONCEPT_LABELS } from '@/features/finance/constants'
import { PaymentStatusActions } from '@/features/finance/components/PaymentStatusActions'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatCurrencyCRC, formatShortDate } from '@/utils/formatters'

interface PaymentsTableProps {
  payments: FinancePaymentViewModel[]
  onView: (payment: FinancePaymentViewModel) => void
  onMarkPaid: (payment: FinancePaymentViewModel) => void
  onGenerateReceipt: (payment: FinancePaymentViewModel) => void
  showMarkPaid?: boolean
}

export function PaymentsTable({
  payments,
  onView,
  onMarkPaid,
  onGenerateReceipt,
  showMarkPaid = true,
}: PaymentsTableProps) {
  if (payments.length === 0) {
    return (
      <div className="rounded-xl border border-primary/10 bg-card px-4 py-8 text-center text-sm text-muted">
        No hay pagos que coincidan con la búsqueda o filtros aplicados.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-primary/10 bg-card">
      <table className="min-w-full text-sm">
        <thead className="bg-primary/5">
          <tr>
            {[
              'ID',
              'Estudiante',
              'Carnet',
              'Concepto',
              'Monto',
              'Estado',
              'Vencimiento',
              'Fecha pago',
              'Acciones',
            ].map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-primary/10">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-primary/5">
              <td className="px-4 py-3 font-medium text-text">{payment.id}</td>
              <td className="px-4 py-3 text-text">{payment.studentName}</td>
              <td className="px-4 py-3 text-text">{payment.studentCarnet}</td>
              <td className="px-4 py-3 text-text">
                <div>
                  <p>{payment.description}</p>
                  <p className="text-xs text-muted">{PAYMENT_CONCEPT_LABELS[payment.concept]}</p>
                </div>
              </td>
              <td className="px-4 py-3 font-medium text-text">
                {formatCurrencyCRC(payment.amount)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={payment.status} />
              </td>
              <td className="px-4 py-3 text-text">{formatShortDate(payment.dueDate)}</td>
              <td className="px-4 py-3 text-text">
                {payment.paidDate ? formatShortDate(payment.paidDate) : '—'}
              </td>
              <td className="px-4 py-3">
                <PaymentStatusActions
                  payment={payment}
                  onView={onView}
                  onMarkPaid={onMarkPaid}
                  onGenerateReceipt={onGenerateReceipt}
                  showMarkPaid={showMarkPaid}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
