import type { CoursePerformanceItem } from '@/features/executive/types'
import { Table, type TableColumn } from '@/components/ui/Table'
import { formatGrade, formatNumber, formatPercentage } from '@/utils/formatters'

interface AcademicPerformanceTableProps {
  title: string
  courses: CoursePerformanceItem[]
  emptyMessage?: string
}

export function AcademicPerformanceTable({
  title,
  courses,
  emptyMessage = 'No hay datos disponibles.',
}: AcademicPerformanceTableProps) {
  const columns: TableColumn<CoursePerformanceItem>[] = [
    { key: 'code', header: 'Código', render: (row) => row.courseCode },
    { key: 'name', header: 'Curso', render: (row) => row.courseName },
    {
      key: 'students',
      header: 'Matriculados',
      render: (row) => formatNumber(row.studentCount),
    },
    {
      key: 'average',
      header: 'Promedio',
      render: (row) => formatGrade(row.averageGrade),
    },
    {
      key: 'passRate',
      header: 'Aprobación',
      render: (row) => formatPercentage(row.passRate, 0),
    },
    {
      key: 'risk',
      header: 'En riesgo',
      render: (row) => formatNumber(row.atRiskCount),
    },
  ]

  return (
    <section className="rounded-xl border border-primary/10 bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-text">{title}</h3>
      <Table
        columns={columns}
        data={courses.map((course) => ({ ...course, id: course.courseId }))}
        emptyMessage={emptyMessage}
      />
    </section>
  )
}
