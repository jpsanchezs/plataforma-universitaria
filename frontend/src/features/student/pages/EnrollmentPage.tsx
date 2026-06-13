import { useMemo, useState } from 'react'
import { MAX_ENROLLED_CREDITS } from '@/features/student/constants'
import { useCurrentStudent } from '@/features/student/hooks/useCurrentStudent'
import { useStudentEnrollments } from '@/features/student/hooks/useStudentEnrollments'
import type { EnrollmentFilter } from '@/features/student/types'
import { CourseEnrollmentCard } from '@/features/student/components/CourseEnrollmentCard'
import { Alert } from '@/components/feedback/Alert'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageShell } from '@/components/layout/PageShell'
import { FilterBar } from '@/components/ui/FilterBar'
import { PageHeader } from '@/components/ui/PageHeader'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import { StatCard } from '@/components/ui/StatCard'
import { FiBookOpen, FiFilter } from 'react-icons/fi'
import { formatNumber } from '@/utils/formatters'

const filterOptions = [
  { value: 'todos', label: 'Todos' },
  { value: 'disponibles', label: 'Disponibles' },
  { value: 'matriculados', label: 'Matriculados' },
  { value: 'sin_cupo', label: 'Sin cupo' },
]

export function EnrollmentPage() {
  const { student } = useCurrentStudent()
  const {
    summary,
    allCourses,
    feedback,
    clearFeedback,
    enrollCourse,
    dropCourse,
    getCourseStatus,
  } = useStudentEnrollments(student?.id)

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<EnrollmentFilter>('todos')

  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      const status = getCourseStatus(course.id)
      const matchesSearch =
        search.trim() === '' ||
        course.code.toLowerCase().includes(search.toLowerCase()) ||
        course.name.toLowerCase().includes(search.toLowerCase())

      const matchesFilter =
        filter === 'todos' ||
        (filter === 'disponibles' && status === 'disponible') ||
        (filter === 'matriculados' && status === 'matriculado') ||
        (filter === 'sin_cupo' && status === 'sin_cupo')

      return matchesSearch && matchesFilter
    })
  }, [allCourses, search, filter, getCourseStatus])

  if (!student) {
    return (
      <PageShell>
        <EmptyState
          title="Matrícula no disponible"
          description="No se encontró un expediente estudiantil vinculado a su usuario demo."
        />
      </PageShell>
    )
  }

  return (
    <PageShell>
      <PageHeader
        title="Matrícula de cursos"
        description={`Gestione su matrícula para el período ${summary?.period?.name ?? 'activo'}. Máximo ${MAX_ENROLLED_CREDITS} créditos.`}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Cursos matriculados"
          value={formatNumber(summary?.courseCount ?? 0)}
          icon={<FiBookOpen size={18} />}
        />
        <StatCard
          label="Créditos matriculados"
          value={`${formatNumber(summary?.totalCredits ?? 0)} / ${MAX_ENROLLED_CREDITS}`}
          icon={<FiBookOpen size={18} />}
        />
        <StatCard
          label="Cursos disponibles"
          value={formatNumber(allCourses.filter((c) => getCourseStatus(c.id) === 'disponible').length)}
          icon={<FiFilter size={18} />}
        />
      </div>

      {feedback ? (
        <Alert
          variant={feedback.type === 'success' ? 'success' : 'error'}
          className="mb-4"
          onDismiss={clearFeedback}
        >
          {feedback.message}
        </Alert>
      ) : null}

      <FilterBar className="mb-6">
        <SearchInput
          className="sm:min-w-72"
          placeholder="Buscar por código o nombre..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select
          label="Filtrar"
          className="sm:min-w-48"
          value={filter}
          options={filterOptions}
          onChange={(event) => setFilter(event.target.value as EnrollmentFilter)}
        />
      </FilterBar>

      {filteredCourses.length === 0 ? (
        <EmptyState
          title="Sin cursos para mostrar"
          description="Ajuste la búsqueda o el filtro para ver más resultados."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => {
            const status = getCourseStatus(course.id)
            return (
              <CourseEnrollmentCard
                key={course.id}
                course={course}
                status={status}
                onEnroll={() => enrollCourse(course.id)}
                onDrop={() => dropCourse(course.id)}
              />
            )
          })}
        </div>
      )}
    </PageShell>
  )
}
