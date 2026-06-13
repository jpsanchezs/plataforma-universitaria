import { useMemo, useState } from 'react'
import type { Student } from '@/types/academic'
import type { EntityStatus } from '@/types/common'
import { useAdminStudents } from '@/features/admin/hooks/useAdminStudents'
import { AdminEntityToolbar } from '@/features/admin/components/AdminEntityToolbar'
import { AdminDataScopeAlert } from '@/features/admin/components/AdminDataScopeAlert'
import { AdminStatusModal } from '@/features/admin/components/AdminStatusModal'
import { EntityDetailModal } from '@/features/admin/components/EntityDetailModal'
import { StudentFormModal } from '@/features/admin/components/StudentFormModal'
import { StudentsTable } from '@/features/admin/components/StudentsTable'
import { studentToFormValues, type StudentStatusFilter } from '@/features/admin/types'
import { Alert } from '@/components/feedback/Alert'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageShell } from '@/components/layout/PageShell'
import { Select } from '@/components/ui/Select'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { FiAward, FiUserCheck, FiUserMinus, FiUsers } from 'react-icons/fi'
import { formatGpa, formatNumber, formatShortDate } from '@/utils/formatters'

const statusFilterOptions = [
  { value: 'todos', label: 'Todos' },
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'graduado', label: 'Graduado' },
]

const statusChangeOptions: { value: EntityStatus; label: string }[] = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'graduado', label: 'Graduado' },
]

export function StudentsManagementPage() {
  const {
    students,
    summary,
    careers,
    campuses,
    feedback,
    formErrors,
    createStudent,
    updateStudent,
    changeStudentStatus,
    clearFeedback,
    clearFormErrors,
    defaultFormValues,
  } = useAdminStudents()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StudentStatusFilter>('todos')
  const [careerFilter, setCareerFilter] = useState('todos')
  const [formOpen, setFormOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [formValues, setFormValues] = useState(defaultFormValues())

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase()
    return students.filter((student) => {
      const matchesSearch =
        query.length === 0 ||
        student.fullName.toLowerCase().includes(query) ||
        student.carnet.toLowerCase().includes(query) ||
        student.career.toLowerCase().includes(query)
      const matchesStatus = statusFilter === 'todos' || student.status === statusFilter
      const matchesCareer = careerFilter === 'todos' || student.career === careerFilter
      return matchesSearch && matchesStatus && matchesCareer
    })
  }, [students, search, statusFilter, careerFilter])

  const openCreate = () => {
    clearFormErrors()
    setSelectedStudent(null)
    setFormValues(defaultFormValues())
    setFormOpen(true)
  }

  const openEdit = (student: Student) => {
    clearFormErrors()
    setSelectedStudent(student)
    setFormValues(studentToFormValues(student))
    setFormOpen(true)
  }

  const openDetail = (student: Student) => {
    setSelectedStudent(student)
    setDetailOpen(true)
  }

  const openStatus = (student: Student) => {
    setSelectedStudent(student)
    setStatusOpen(true)
  }

  const handleSubmit = (values: typeof formValues) => {
    const success = selectedStudent
      ? updateStudent(selectedStudent.id, values)
      : createStudent(values)
    if (success) {
      setFormOpen(false)
    }
  }

  return (
    <PageShell>
      <PageHeader
        title="Gestión de estudiantes"
        description="Administre expedientes, estados académicos y datos de contacto institucional."
      />

      <AdminDataScopeAlert scope="students" className="mb-4" />

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
        <StatCard label="Total estudiantes" value={formatNumber(summary.total)} icon={<FiUsers size={18} />} />
        <StatCard label="Activos" value={formatNumber(summary.active)} icon={<FiUserCheck size={18} />} />
        <StatCard label="Inactivos" value={formatNumber(summary.inactive)} icon={<FiUserMinus size={18} />} />
        <StatCard label="Graduados" value={formatNumber(summary.graduated)} icon={<FiAward size={18} />} />
      </div>

      <AdminEntityToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nombre, carnet o carrera"
        onCreate={openCreate}
        createLabel="Nuevo estudiante"
        filters={
          <>
            <Select
              label="Estado"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StudentStatusFilter)}
              options={statusFilterOptions}
              className="min-w-40"
            />
            <Select
              label="Carrera"
              value={careerFilter}
              onChange={(event) => setCareerFilter(event.target.value)}
              options={[
                { value: 'todos', label: 'Todas' },
                ...careers.map((career) => ({ value: career, label: career })),
              ]}
              className="min-w-48"
            />
          </>
        }
      />

      {filteredStudents.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          description="No hay estudiantes que coincidan con la búsqueda o filtros aplicados."
        />
      ) : (
        <StudentsTable
          students={filteredStudents}
          onView={openDetail}
          onEdit={openEdit}
          onChangeStatus={openStatus}
        />
      )}

      <StudentFormModal
        key={selectedStudent?.id ?? 'new-student'}
        open={formOpen}
        title={selectedStudent ? 'Editar estudiante' : 'Nuevo estudiante'}
        initialValues={formValues}
        careers={careers}
        campuses={campuses}
        errors={formErrors}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <EntityDetailModal
        open={detailOpen}
        title="Detalle del estudiante"
        onClose={() => setDetailOpen(false)}
        fields={
          selectedStudent
            ? [
                { label: 'Carnet', value: selectedStudent.carnet },
                { label: 'Nombre', value: selectedStudent.fullName },
                { label: 'Carrera', value: selectedStudent.career },
                { label: 'Semestre', value: selectedStudent.semester },
                { label: 'Campus', value: selectedStudent.campus },
                { label: 'GPA', value: formatGpa(selectedStudent.gpa) },
                { label: 'Correo', value: selectedStudent.email || '—' },
                { label: 'Teléfono', value: selectedStudent.phone || '—' },
                {
                  label: 'Fecha de ingreso',
                  value: formatShortDate(selectedStudent.enrollmentDate),
                },
                {
                  label: 'Estado',
                  value: <StatusBadge status={selectedStudent.status} />,
                },
              ]
            : []
        }
      />

      {selectedStudent ? (
        <AdminStatusModal<EntityStatus>
          key={selectedStudent.id}
          open={statusOpen}
          title="Cambiar estado del estudiante"
          currentStatus={selectedStudent.status}
          options={statusChangeOptions}
          onClose={() => setStatusOpen(false)}
          onSave={(status) => {
            changeStudentStatus(selectedStudent.id, status)
            setStatusOpen(false)
          }}
        />
      ) : null}
    </PageShell>
  )
}
