import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

interface StatusOption<T extends string> {
  value: T
  label: string
}

interface AdminStatusModalProps<T extends string> {
  open: boolean
  title: string
  currentStatus: T
  options: StatusOption<T>[]
  onClose: () => void
  onSave: (status: T) => void
}

export function AdminStatusModal<T extends string>({
  open,
  title,
  currentStatus,
  options,
  onClose,
  onSave,
}: AdminStatusModalProps<T>) {
  const [status, setStatus] = useState(currentStatus)

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={() => onSave(status)}>Guardar estado</Button>
        </div>
      }
    >
      <Select
        label="Estado"
        value={status}
        onChange={(event) => setStatus(event.target.value as T)}
        options={options}
      />
    </Modal>
  )
}
