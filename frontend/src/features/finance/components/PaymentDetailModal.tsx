import type { FinancePaymentViewModel } from '@/features/finance/types'
import { PAYMENT_CONCEPT_LABELS } from '@/features/finance/constants'
import { EntityDetailModal } from '@/features/admin/components/EntityDetailModal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatCurrencyCRC, formatShortDate } from '@/utils/formatters'

interface PaymentDetailModalProps {
  open: boolean
  payment: FinancePaymentViewModel | null
  onClose: () => void
}

export function PaymentDetailModal({ open, payment, onClose }: PaymentDetailModalProps) {
  return (
    <EntityDetailModal
      open={open}
      title="Detalle del pago"
      onClose={onClose}
      fields={
        payment
          ? [
              { label: 'ID', value: payment.id },
              { label: 'Estudiante', value: payment.studentName },
              { label: 'Carnet', value: payment.studentCarnet },
              { label: 'Concepto', value: PAYMENT_CONCEPT_LABELS[payment.concept] },
              { label: 'Descripción', value: payment.description },
              { label: 'Monto', value: formatCurrencyCRC(payment.amount) },
              { label: 'Estado', value: <StatusBadge status={payment.status} /> },
              { label: 'Vencimiento', value: formatShortDate(payment.dueDate) },
              {
                label: 'Fecha de pago',
                value: payment.paidDate ? formatShortDate(payment.paidDate) : '—',
              },
              { label: 'Período', value: payment.periodId },
            ]
          : []
      }
    />
  )
}
