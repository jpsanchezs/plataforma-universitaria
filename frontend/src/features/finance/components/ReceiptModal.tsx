import type { ReceiptInfo } from '@/features/finance/types'
import { PAYMENT_CONCEPT_LABELS } from '@/features/finance/constants'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { formatCurrencyCRC, formatShortDate } from '@/utils/formatters'

interface ReceiptModalProps {
  open: boolean
  receipt: ReceiptInfo | null
  onClose: () => void
}

export function ReceiptModal({ open, receipt, onClose }: ReceiptModalProps) {
  return (
    <Modal
      open={open}
      title="Comprobante de pago simulado"
      onClose={onClose}
      footer={
        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      }
    >
      {receipt ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-primary/10 bg-primary/5 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-muted">Universidad Tecnológica La Mejor</p>
            <p className="mt-1 text-lg font-semibold text-primary">Comprobante #{receipt.receiptNumber}</p>
            <p className="text-sm text-muted">Emitido el {formatShortDate(receipt.issuedAt)}</p>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Estudiante</dt>
              <dd className="text-right text-text">{receipt.studentName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Carnet</dt>
              <dd className="text-text">{receipt.studentCarnet}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Concepto</dt>
              <dd className="text-text">{PAYMENT_CONCEPT_LABELS[receipt.concept]}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Descripción</dt>
              <dd className="text-right text-text">{receipt.description}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Monto</dt>
              <dd className="font-semibold text-text">{formatCurrencyCRC(receipt.amount)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Fecha de pago</dt>
              <dd className="text-text">{formatShortDate(receipt.paidDate)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">ID de pago</dt>
              <dd className="text-text">{receipt.paymentId}</dd>
            </div>
          </dl>
          <p className="text-xs text-muted">
            Documento simulado para prototipo. No constituye comprobante fiscal ni transacción real.
          </p>
        </div>
      ) : null}
    </Modal>
  )
}
