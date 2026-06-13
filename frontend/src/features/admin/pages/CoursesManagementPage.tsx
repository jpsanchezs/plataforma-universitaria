import { useMemo, useState } from 'react'
import type { Course } from '@/types/academic'
import { useAdminCourses } from '@/features/admin/hooks/useAdminCourses'
import { AdminEntityToolbar } from '@/features/admin/components/AdminEntityToolbar'
import { AdminDataScopeAlert } from '@/features/admin/components/AdminDataScopeAlert'
import { CourseFormModal } from '@/features/admin/components/CourseFormModal'
import { CoursesTable } from '@/features/admin/components/CoursesTable'
import { EntityDetailModal } from '@/features/admin/components/EntityDetailModal'
import { courseToFormValues, type CourseAvailabilityFilter } from '@/features/admin/types'
import {
  getCourseEnrollmentCount,
  getCourseScheduleSummary,
  getEffectiveAvailableSeats,
  getEffectivePeriodById,
  getEffectiveTeacherById,
} from '@/data/selectors'
import { Alert } from '@/components/feedback/Alert'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageShell } from '@/components/layout/PageShell'
import { Select } from '@/components/ui/Select'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { FiBookOpen, FiCalendar, FiGrid, FiUsers } from 'react-icons/fi'
import { formatNumber } from '@/utils/formatters'

export function CoursesManagementPage() {
  const {
    courses,
    teachers,
    periods,
    summary,
    storage,
    teacherStorage,
    periodStorage,
    feedback,
    formErrors,
    createCourse,
    updateCourse,
    changeCourseStatus,
    clearFeedback,
    clearFormErrors,
    defaultFormValues,
  } = useAdminCourses()

  const [search, setSearch] = useState('')
  const [periodFilter, setPeriodFilter] = useState('todos')
  const [teacherFilter, setTeacherFilter] = useState('todos')
  const [availabilityFilter, setAvailabilityFilter] =
    useState<CourseAvailabilityFilter>('todos')
  const [formOpen, setFormOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [formValues, setFormValues] = useState(defaultFormValues())

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase()
    return courses.filter((course) => {
      const matchesSearch =
        query.length === 0 ||
        course.code.toLowerCase().includes(query) ||
        course.name.toLowerCase().includes(query)
      const matchesPeriod = periodFilter === 'todos' || course.periodId === periodFilter
      const matchesTeacher = teacherFilter === 'todos' || course.teacherId === teacherFilter
      const availableSeats = getEffectiveAvailableSeats(course.id, storage)
      const matchesAvailability =
        availabilityFilter === 'todos' ||
        (availabilityFilter === 'con_cupo' && availableSeats > 0) ||
        (availabilityFilter === 'sin_cupo' && availableSeats === 0)
      return matchesSearch && matchesPeriod && matchesTeacher && matchesAvailability
    })
  }, [courses, search, periodFilter, teacherFilter, availabilityFilter, storage])

  const openCreate = () => {
    clearFormErrors()
    setSelectedCourse(null)
    const defaults = defaultFormValues()
    setFormValues({
      ...defaults,
      periodId: periods.find((period) => period.status === 'activo')?.id ?? periods[0]?.id ?? '',
      teacherId: teachers[0]?.id ?? '',
    })
    setFormOpen(true)
  }

  const openEdit = (course: Course) => {
    clearFormErrors()
    setSelectedCourse(course)
    setFormValues(courseToFormValues(course))
    setFormOpen(true)
  }

  const handleSubmit = (values: typeof formValues) => {
    const success = selectedCourse
      ? updateCourse(selectedCourse.id, values)
      : createCourse(values)
    if (success) {
      setFormOpen(false)
    }
  }

  return (
    <PageShell>
      <PageHeader
        title="Gestión de cursos"
        description="Administre la oferta académica, cupos, docentes asignados y períodos."
      />

      <AdminDataScopeAlert scope="courses" className="mb-4" />

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
        <StatCard label="Total cursos" value={formatNumber(summary.total)} icon={<FiBookOpen size={18} />} />
        <StatCard
          label="Cursos del período actual"
          value={formatNumber(summary.currentPeriodCount)}
          icon={<FiCalendar size={18} />}
        />
        <StatCard
          label="Créditos ofertados"
          value={formatNumber(summary.creditsOffered)}
          icon={<FiGrid size={18} />}
        />
        <StatCard
          label="Cupos disponibles"
          value={formatNumber(summary.availableSeats)}
          icon={<FiUsers size={18} />}
        />
      </div>

      <AdminEntityToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por código o nombre"
        onCreate={openCreate}
        createLabel="Nuevo curso"
        filters={
          <>
            <Select
              label="Período"
              value={periodFilter}
              onChange={(event) => setPeriodFilter(event.target.value)}
              options={[
                { value: 'todos', label: 'Todos' },
                ...periods.map((period) => ({ value: period.id, label: period.name })),
              ]}
              className="min-w-40"
            />
            <Select
              label="Docente"
              value={teacherFilter}
              onChange={(event) => setTeacherFilter(event.target.value)}
              options={[
                { value: 'todos', label: 'Todos' },
                ...teachers.map((teacher) => ({ value: teacher.id, label: teacher.fullName })),
              ]}
              className="min-w-48"
            />
            <Select
              label="Cupo"
              value={availabilityFilter}
              onChange={(event) =>
                setAvailabilityFilter(event.target.value as CourseAvailabilityFilter)
              }
              options={[
                { value: 'todos', label: 'Todos' },
                { value: 'con_cupo', label: 'Con cupo' },
                { value: 'sin_cupo', label: 'Sin cupo' },
              ]}
              className="min-w-36"
            />
          </>
        }
      />

      {filteredCourses.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          description="No hay cursos que coincidan con la búsqueda o filtros aplicados."
        />
      ) : (
        <CoursesTable
          courses={filteredCourses}
          courseStorage={storage}
          teacherStorage={teacherStorage}
          periodStorage={periodStorage}
          onView={(course) => {
            setSelectedCourse(course)
            setDetailOpen(true)
          }}
          onEdit={openEdit}
          onToggleStatus={(course) =>
            changeCourseStatus(course.id, course.status === 'activo' ? 'inactivo' : 'activo')
          }
        />
      )}

      <CourseFormModal
        key={selectedCourse?.id ?? 'new-course'}
        open={formOpen}
        title={selectedCourse ? 'Editar curso' : 'Nuevo curso'}
        initialValues={formValues}
        teachers={teachers.filter((teacher) => teacher.status === 'activo')}
        periods={periods}
        errors={formErrors}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <EntityDetailModal
        open={detailOpen}
        title="Detalle del curso"
        onClose={() => setDetailOpen(false)}
        fields={
          selectedCourse
            ? [
                { label: 'Código', value: selectedCourse.code },
                { label: 'Nombre', value: selectedCourse.name },
                { label: 'Créditos', value: selectedCourse.credits },
                {
                  label: 'Docente',
                  value:
                    getEffectiveTeacherById(selectedCourse.teacherId, teacherStorage)?.fullName ??
                    '—',
                },
                {
                  label: 'Período',
                  value:
                    getEffectivePeriodById(selectedCourse.periodId, periodStorage)?.name ?? '—',
                },
                { label: 'Capacidad', value: formatNumber(selectedCourse.capacity) },
                {
                  label: 'Matriculados',
                  value: formatNumber(
                    Math.max(selectedCourse.enrolled, getCourseEnrollmentCount(selectedCourse.id)),
                  ),
                },
                {
                  label: 'Cupo disponible',
                  value: formatNumber(getEffectiveAvailableSeats(selectedCourse.id, storage)),
                },
                { label: 'Aula', value: selectedCourse.room },
                { label: 'Horario', value: getCourseScheduleSummary(selectedCourse.id) },
                { label: 'Estado', value: <StatusBadge status={selectedCourse.status} /> },
              ]
            : []
        }
      />
    </PageShell>
  )
}
