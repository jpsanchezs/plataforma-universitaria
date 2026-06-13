import type { FinancePaymentViewModel } from '@/features/finance/types'
import { Button } from '@/components/ui/Button'

interface PaymentStatusActionsProps {
  payment: FinancePaymentViewModel
  onView: (payment: FinancePaymentViewModel) => void
  onMarkPaid: (payment: FinancePaymentViewModel) => void
  onGenerateReceipt: (payment: FinancePaymentViewModel) => void
  showMarkPaid?: boolean
}

export function PaymentStatusActions({
  payment,
  onView,
  onMarkPaid,
  onGenerateReceipt,
  showMarkPaid = true,
}: PaymentStatusActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => onView(payment)}>
        Ver
      </Button>
      {showMarkPaid ? (
        <Button
          variant="ghost"
          className="px-2 py-1 text-xs"
          onClick={() => onMarkPaid(payment)}
          disabled={payment.status === 'pagado'}
        >
          Marcar pagado
        </Button>
      ) : null}
      <Button
        variant="ghost"
        className="px-2 py-1 text-xs"
        onClick={() => onGenerateReceipt(payment)}
        disabled={payment.status !== 'pagado'}
      >
        Comprobante
      </Button>
    </div>
  )
}
