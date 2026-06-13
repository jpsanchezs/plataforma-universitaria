import type { EntityStatus } from '@/types/common'
import type { StudentFormValues } from '@/features/admin/types'
import type { FormErrors } from '@/features/admin/utils/validation'
import { useAdminFormState } from '@/features/admin/hooks/useAdminFormState'
import { AdminFormModal } from '@/features/admin/components/AdminFormModal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { MAX_GPA, MAX_SEMESTER, MIN_GPA, MIN_SEMESTER } from '@/features/admin/constants'

interface StudentFormModalProps {
  open: boolean
  title: string
  initialValues: StudentFormValues
  careers: string[]
  campuses: string[]
  errors: FormErrors<StudentFormValues>
  onClose: () => void
  onSubmit: (values: StudentFormValues) => void
}

const statusOptions = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'graduado', label: 'Graduado' },
]

export function StudentFormModal({
  open,
  title,
  initialValues,
  careers,
  campuses,
  errors,
  onClose,
  onSubmit,
}: StudentFormModalProps) {
  const { values, update } = useAdminFormState(initialValues)

  return (
    <AdminFormModal
      open={open}
      title={title}
      onClose={onClose}
      onSubmit={() => onSubmit(values)}
      className="max-w-2xl"
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
          label="Carnet"
          value={values.carnet}
          onChange={(event) => update('carnet', event.target.value)}
          error={errors.carnet}
        />
        <Input
          label="Carrera"
          value={values.career}
          onChange={(event) => update('career', event.target.value)}
          error={errors.career}
          list="admin-careers"
        />
        <datalist id="admin-careers">
          {careers.map((career) => (
            <option key={career} value={career} />
          ))}
        </datalist>
        <Input
          label="Semestre"
          type="number"
          min={MIN_SEMESTER}
          max={MAX_SEMESTER}
          value={values.semester}
          onChange={(event) => update('semester', Number(event.target.value))}
          error={errors.semester}
        />
        <Input
          label="Campus"
          value={values.campus}
          onChange={(event) => update('campus', event.target.value)}
          error={errors.campus}
          list="admin-campuses"
        />
        <datalist id="admin-campuses">
          {campuses.map((campus) => (
            <option key={campus} value={campus} />
          ))}
        </datalist>
        <Input
          label="GPA"
          type="number"
          min={MIN_GPA}
          max={MAX_GPA}
          step={0.01}
          value={values.gpa}
          onChange={(event) => update('gpa', Number(event.target.value))}
          error={errors.gpa}
        />
        <Input
          label="Correo institucional"
          type="email"
          value={values.email}
          onChange={(event) => update('email', event.target.value)}
          error={errors.email}
        />
        <Input
          label="Teléfono"
          value={values.phone}
          onChange={(event) => update('phone', event.target.value)}
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
