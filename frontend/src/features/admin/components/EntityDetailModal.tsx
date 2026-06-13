import type { ReactNode } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

export interface DetailField {
  label: string
  value: ReactNode
}

interface EntityDetailModalProps {
  open: boolean
  title: string
  fields: DetailField[]
  onClose: () => void
  footer?: ReactNode
}

export function EntityDetailModal({
  open,
  title,
  fields,
  onClose,
  footer,
}: EntityDetailModalProps) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        footer ?? (
          <div className="flex justify-end">
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        )
      }
    >
      <dl className="space-y-3">
        {fields.map((field) => (
          <div key={field.label} className="grid gap-1 sm:grid-cols-3">
            <dt className="text-sm font-medium text-muted">{field.label}</dt>
            <dd className="text-sm text-text sm:col-span-2">{field.value}</dd>
          </div>
        ))}
      </dl>
    </Modal>
  )
}
