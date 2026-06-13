import type { EntityStatus } from '@/types/common'
import type { TeacherFormValues } from '@/features/admin/types'
import type { FormErrors } from '@/features/admin/utils/validation'
import { useAdminFormState } from '@/features/admin/hooks/useAdminFormState'
import { AdminFormModal } from '@/features/admin/components/AdminFormModal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

interface TeacherFormModalProps {
  open: boolean
  title: string
  initialValues: TeacherFormValues
  departments: string[]
  errors: FormErrors<TeacherFormValues>
  onClose: () => void
  onSubmit: (values: TeacherFormValues) => void
}

const statusOptions = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
]

export function TeacherFormModal({
  open,
  title,
  initialValues,
  departments,
  errors,
  onClose,
  onSubmit,
}: TeacherFormModalProps) {
  const { values, update } = useAdminFormState(initialValues)

  return (
    <AdminFormModal
      open={open}
      title={title}
      onClose={onClose}
      onSubmit={() => onSubmit(values)}
      className="max-w-xl"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Nombre completo"
          value={values.fullName}
          onChange={(event) => update('fullName', event.target.value)}
          error={errors.fullName}
          className="sm:col-span-2"
        />
        <Input
          label="Departamento"
          value={values.department}
          onChange={(event) => update('department', event.target.value)}
          error={errors.department}
          list="admin-departments"
        />
        <datalist id="admin-departments">
          {departments.map((department) => (
            <option key={department} value={department} />
          ))}
        </datalist>
        <Input
          label="Especialidad"
          value={values.specialty}
          onChange={(event) => update('specialty', event.target.value)}
          error={errors.specialty}
        />
        <Input
          label="Correo institucional"
          type="email"
          value={values.email}
          onChange={(event) => update('email', event.target.value)}
          error={errors.email}
          className="sm:col-span-2"
        />
        <Select
          label="Estado"
          value={values.status}
          onChange={(event) => update('status', event.target.value as EntityStatus)}
          options={statusOptions}
        />
      </div>
    </AdminFormModal>
  )
}
