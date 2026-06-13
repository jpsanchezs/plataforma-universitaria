import type { Teacher, AcademicPeriod } from '@/types/academic'
import type { EntityStatus } from '@/types/common'
import type { CourseFormValues } from '@/features/admin/types'
import type { FormErrors } from '@/features/admin/utils/validation'
import { useAdminFormState } from '@/features/admin/hooks/useAdminFormState'
import { AdminFormModal } from '@/features/admin/components/AdminFormModal'
import {
  MAX_COURSE_CREDITS,
  MIN_COURSE_CAPACITY,
  MIN_COURSE_CREDITS,
} from '@/features/admin/constants'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

interface CourseFormModalProps {
  open: boolean
  title: string
  initialValues: CourseFormValues
  teachers: Teacher[]
  periods: AcademicPeriod[]
  errors: FormErrors<CourseFormValues>
  onClose: () => void
  onSubmit: (values: CourseFormValues) => void
}

const statusOptions = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
]

export function CourseFormModal({
  open,
  title,
  initialValues,
  teachers,
  periods,
  errors,
  onClose,
  onSubmit,
}: CourseFormModalProps) {
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
          label="Código"
          value={values.code}
          onChange={(event) => update('code', event.target.value)}
          error={errors.code}
        />
        <Input
          label="Nombre"
          value={values.name}
          onChange={(event) => update('name', event.target.value)}
          error={errors.name}
        />
        <Input
          label="Créditos"
          type="number"
          min={MIN_COURSE_CREDITS}
          max={MAX_COURSE_CREDITS}
          value={values.credits}
          onChange={(event) => update('credits', Number(event.target.value))}
          error={errors.credits}
        />
        <Input
          label="Capacidad"
          type="number"
          min={MIN_COURSE_CAPACITY}
          value={values.capacity}
          onChange={(event) => update('capacity', Number(event.target.value))}
          error={errors.capacity}
        />
        <Select
          label="Docente"
          value={values.teacherId}
          onChange={(event) => update('teacherId', event.target.value)}
          error={errors.teacherId}
          options={teachers.map((teacher) => ({
            value: teacher.id,
            label: teacher.fullName,
          }))}
          placeholder="Seleccione docente"
        />
        <Select
          label="Período académico"
          value={values.periodId}
          onChange={(event) => update('periodId', event.target.value)}
          error={errors.periodId}
          options={periods.map((period) => ({
            value: period.id,
            label: `${period.name} (${period.status})`,
          }))}
          placeholder="Seleccione período"
        />
        <Input
          label="Aula / horario resumido"
          value={values.room}
          onChange={(event) => update('room', event.target.value)}
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
