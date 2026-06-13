import type { ReactNode } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface AdminFormModalProps {
  open: boolean
  title: string
  onClose: () => void
  onSubmit: () => void
  children: ReactNode
  className?: string
  submitLabel?: string
}

export function AdminFormModal({
  open,
  title,
  onClose,
  onSubmit,
  children,
  className,
  submitLabel = 'Guardar',
}: AdminFormModalProps) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      className={className}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSubmit}>{submitLabel}</Button>
        </div>
      }
    >
      {children}
    </Modal>
  )
}
