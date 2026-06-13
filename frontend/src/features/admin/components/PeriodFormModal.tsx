import type { PeriodStatus } from '@/types/academic'
import type { PeriodFormValues } from '@/features/admin/types'
import type { FormErrors } from '@/features/admin/utils/validation'
import { useAdminFormState } from '@/features/admin/hooks/useAdminFormState'
import { AdminFormModal } from '@/features/admin/components/AdminFormModal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

interface PeriodFormModalProps {
  open: boolean
  title: string
  initialValues: PeriodFormValues
  errors: FormErrors<PeriodFormValues>
  onClose: () => void
  onSubmit: (values: PeriodFormValues) => void
}

const statusOptions = [
  { value: 'activo', label: 'Activo' },
  { value: 'cerrado', label: 'Cerrado' },
  { value: 'planificado', label: 'Planificado' },
]

export function PeriodFormModal({
  open,
  title,
  initialValues,
  errors,
  onClose,
  onSubmit,
}: PeriodFormModalProps) {
  const { values, update } = useAdminFormState(initialValues)

  return (
    <AdminFormModal
      open={open}
      title={title}
      onClose={onClose}
      onSubmit={() => onSubmit(values)}
    >
      <div className="grid gap-4">
        <Input
          label="Nombre"
          value={values.name}
          onChange={(event) => update('name', event.target.value)}
          error={errors.name}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Fecha inicio"
            type="date"
            value={values.startDate}
            onChange={(event) => update('startDate', event.target.value)}
            error={errors.startDate}
          />
          <Input
            label="Fecha fin"
            type="date"
            value={values.endDate}
            onChange={(event) => update('endDate', event.target.value)}
            error={errors.endDate}
          />
        </div>
        <Select
          label="Estado"
          value={values.status}
          onChange={(event) => update('status', event.target.value as PeriodStatus)}
          error={errors.status}
          options={statusOptions}
        />
      </div>
    </AdminFormModal>
  )
}
