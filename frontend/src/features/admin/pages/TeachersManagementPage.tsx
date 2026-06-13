import { useMemo, useState } from 'react'
import type { Teacher } from '@/types/academic'
import type { EntityStatus } from '@/types/common'
import { useAdminTeachers } from '@/features/admin/hooks/useAdminTeachers'
import { AdminEntityToolbar } from '@/features/admin/components/AdminEntityToolbar'
import { AdminDataScopeAlert } from '@/features/admin/components/AdminDataScopeAlert'
import { AdminStatusModal } from '@/features/admin/components/AdminStatusModal'
import { EntityDetailModal } from '@/features/admin/components/EntityDetailModal'
import { TeacherFormModal } from '@/features/admin/components/TeacherFormModal'
import { TeachersTable } from '@/features/admin/components/TeachersTable'
import { teacherToFormValues, type TeacherStatusFilter } from '@/features/admin/types'
import { getCoursesCountByTeacherId } from '@/data/selectors'
import { Alert } from '@/components/feedback/Alert'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageShell } from '@/components/layout/PageShell'
import { Select } from '@/components/ui/Select'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { FiBookOpen, FiLayers, FiUserCheck, FiUsers } from 'react-icons/fi'
import { formatNumber, formatShortDate } from '@/utils/formatters'

const statusFilterOptions = [
  { value: 'todos', label: 'Todos' },
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
]

const statusChangeOptions: { value: EntityStatus; label: string }[] = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
]

export function TeachersManagementPage() {
  const {
    teachers,
    summary,
    departments,
    courseStorage,
    feedback,
    formErrors,
    createTeacher,
    updateTeacher,
    changeTeacherStatus,
    clearFeedback,
    clearFormErrors,
    defaultFormValues,
  } = useAdminTeachers()

  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('todos')
  const [statusFilter, setStatusFilter] = useState<TeacherStatusFilter>('todos')
  const [formOpen, setFormOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [formValues, setFormValues] = useState(defaultFormValues())

  const filteredTeachers = useMemo(() => {
    const query = search.trim().toLowerCase()
    return teachers.filter((teacher) => {
      const matchesSearch =
        query.length === 0 ||
        teacher.fullName.toLowerCase().includes(query) ||
        teacher.department.toLowerCase().includes(query) ||
        teacher.specialty.toLowerCase().includes(query)
      const matchesDepartment =
        departmentFilter === 'todos' || teacher.department === departmentFilter
      const matchesStatus = statusFilter === 'todos' || teacher.status === statusFilter
      return matchesSearch && matchesDepartment && matchesStatus
    })
  }, [teachers, search, departmentFilter, statusFilter])

  const openCreate = () => {
    clearFormErrors()
    setSelectedTeacher(null)
    setFormValues(defaultFormValues())
    setFormOpen(true)
  }

  const openEdit = (teacher: Teacher) => {
    clearFormErrors()
    setSelectedTeacher(teacher)
    setFormValues(teacherToFormValues(teacher))
    setFormOpen(true)
  }

  const handleSubmit = (values: typeof formValues) => {
    const success = selectedTeacher
      ? updateTeacher(selectedTeacher.id, values)
      : createTeacher(values)
    if (success) {
      setFormOpen(false)
    }
  }

  return (
    <PageShell>
      <PageHeader
        title="Gestión de docentes"
        description="Administre el directorio docente, departamentos y asignaciones académicas."
      />

      <AdminDataScopeAlert scope="teachers" className="mb-4" />

      {feedback ? (
        <Alert
          variant={feedback.type === 'success' ? 'success' : 'error'}
          className="mb-4"
          onDismiss={clearFeedback}
        >
          {feedback.message}
        </Alert>
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total docentes" value={formatNumber(summary.total)} icon={<FiUsers size={18} />} />
        <StatCard label="Docentes activos" value={formatNumber(summary.active)} icon={<FiUserCheck size={18} />} />
        <StatCard label="Departamentos" value={formatNumber(summary.departments)} icon={<FiLayers size={18} />} />
        <StatCard
          label="Cursos asignados"
          value={formatNumber(summary.assignedCourses)}
          icon={<FiBookOpen size={18} />}
        />
      </div>

      <AdminEntityToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nombre, departamento o especialidad"
        onCreate={openCreate}
        createLabel="Nuevo docente"
        filters={
          <>
            <Select
              label="Departamento"
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              options={[
                { value: 'todos', label: 'Todos' },
                ...departments.map((department) => ({ value: department, label: department })),
              ]}
              className="min-w-44"
            />
            <Select
              label="Estado"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as TeacherStatusFilter)}
              options={statusFilterOptions}
              className="min-w-36"
            />
          </>
        }
      />

      {filteredTeachers.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          description="No hay docentes que coincidan con la búsqueda o filtros aplicados."
        />
      ) : (
        <TeachersTable
          teachers={filteredTeachers}
          courseStorage={courseStorage}
          onView={(teacher) => {
            setSelectedTeacher(teacher)
            setDetailOpen(true)
          }}
          onEdit={openEdit}
          onChangeStatus={(teacher) => {
            setSelectedTeacher(teacher)
            setStatusOpen(true)
          }}
        />
      )}

      <TeacherFormModal
        key={selectedTeacher?.id ?? 'new-teacher'}
        open={formOpen}
        title={selectedTeacher ? 'Editar docente' : 'Nuevo docente'}
        initialValues={formValues}
        departments={departments}
        errors={formErrors}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <EntityDetailModal
        open={detailOpen}
        title="Detalle del docente"
        onClose={() => setDetailOpen(false)}
        fields={
          selectedTeacher
            ? [
                { label: 'Nombre', value: selectedTeacher.fullName },
                { label: 'Departamento', value: selectedTeacher.department },
                { label: 'Especialidad', value: selectedTeacher.specialty },
                { label: 'Correo', value: selectedTeacher.email },
                {
                  label: 'Cursos asignados',
                  value: formatNumber(
                    getCoursesCountByTeacherId(selectedTeacher.id, courseStorage),
                  ),
                },
                { label: 'Fecha de ingreso', value: formatShortDate(selectedTeacher.hireDate) },
                { label: 'Estado', value: <StatusBadge status={selectedTeacher.status} /> },
              ]
            : []
        }
      />

      {selectedTeacher ? (
        <AdminStatusModal<EntityStatus>
          key={selectedTeacher.id}
          open={statusOpen}
          title="Cambiar estado del docente"
          currentStatus={selectedTeacher.status}
          options={statusChangeOptions}
          onClose={() => setStatusOpen(false)}
          onSave={(status) => {
            changeTeacherStatus(selectedTeacher.id, status)
            setStatusOpen(false)
          }}
        />
      ) : null}
    </PageShell>
  )
}
