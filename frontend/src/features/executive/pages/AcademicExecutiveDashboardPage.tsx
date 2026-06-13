import { useMemo } from 'react'
import {
  getAcademicPerformanceSummary,
  getCourseEnrollmentRanking,
  getCoursesAtAcademicRisk,
  getCoursesByDepartmentSummary,
  getEnrollmentCountByPeriod,
  getExecutiveAcademicSummary,
  getExecutiveFinancialSummary,
  getFinancialBreakdownByConcept,
  getPaymentsStatusBreakdown,
  getRevenueTrendByPeriod,
  getStudentsByStatusChartData,
  getTopPerformingCourses,
} from '@/data/selectors'
import { useFinancePaymentStorage } from '@/features/finance/hooks/useFinancePaymentStorage'
import { TEACHER_GRADES_STORAGE_KEY } from '@/features/teacher/constants'
import type { TeacherGradesStorage } from '@/features/teacher/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { AcademicPerformanceTable } from '@/features/executive/components/AcademicPerformanceTable'
import { ExecutiveChartCard } from '@/features/executive/components/ExecutiveChartCard'
import { FinancialBreakdownChart } from '@/features/executive/components/FinancialBreakdownChart'
import { EXECUTIVE_CHART_COLORS } from '@/features/executive/constants'
import { Alert } from '@/components/feedback/Alert'
import { PageShell } from '@/components/layout/PageShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { Table, type TableColumn } from '@/components/ui/Table'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { PaymentStatusBreakdownItem } from '@/features/executive/types'
import type { CourseEnrollmentRankItem } from '@/features/executive/types'
import {
  formatCurrencyCRC,
  formatGpa,
  formatGrade,
  formatNumber,
  formatPercentage,
} from '@/utils/formatters'
import {
  FiAlertCircle,
  FiBookOpen,
  FiDollarSign,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export function AcademicExecutiveDashboardPage() {
  const [paymentStorage] = useFinancePaymentStorage()
  const [gradeOverrides] = useLocalStorage<TeacherGradesStorage>(
    TEACHER_GRADES_STORAGE_KEY,
    {},
  )

  const summary = useMemo(
    () => getExecutiveAcademicSummary(paymentStorage, gradeOverrides),
    [paymentStorage, gradeOverrides],
  )
  const financial = useMemo(
    () => getExecutiveFinancialSummary(paymentStorage),
    [paymentStorage],
  )
  const studentsByStatusChart = useMemo(() => getStudentsByStatusChartData(), [])
  const enrollmentByPeriod = useMemo(() => getEnrollmentCountByPeriod(), [])
  const coursesByDepartment = useMemo(() => getCoursesByDepartmentSummary(), [])
  const performance = useMemo(
    () => getAcademicPerformanceSummary(gradeOverrides),
    [gradeOverrides],
  )
  const conceptBreakdown = useMemo(
    () => getFinancialBreakdownByConcept(paymentStorage),
    [paymentStorage],
  )
  const paymentStatusBreakdown = useMemo(
    () => getPaymentsStatusBreakdown(paymentStorage),
    [paymentStorage],
  )
  const revenueTrend = useMemo(
    () => getRevenueTrendByPeriod(paymentStorage),
    [paymentStorage],
  )
  const topCourses = useMemo(
    () => getCourseEnrollmentRanking(5),
    [],
  )
  const bestCourses = useMemo(
    () => getTopPerformingCourses(gradeOverrides, 5),
    [gradeOverrides],
  )
  const riskCourses = useMemo(
    () => getCoursesAtAcademicRisk(gradeOverrides, 5),
    [gradeOverrides],
  )

  const enrollmentColumns: TableColumn<CourseEnrollmentRankItem>[] = [
    { key: 'code', header: 'Código', render: (row) => row.courseCode },
    { key: 'name', header: 'Curso', render: (row) => row.courseName },
    { key: 'teacher', header: 'Docente', render: (row) => row.teacherName },
    {
      key: 'count',
      header: 'Matriculados',
      render: (row) => formatNumber(row.enrollmentCount),
    },
  ]

  const paymentStatusColumns: TableColumn<PaymentStatusBreakdownItem>[] = [
    {
      key: 'status',
      header: 'Estado',
      render: (row) => <StatusBadge status={row.status} />,
    },
    { key: 'count', header: 'Transacciones', render: (row) => formatNumber(row.count) },
    {
      key: 'amount',
      header: 'Monto',
      render: (row) => formatCurrencyCRC(row.amount),
    },
  ]

  return (
    <PageShell>
      <PageHeader
        title="Dashboard Ejecutivo Académico"
        description="Indicadores consolidados de matrícula, rendimiento académico e ingresos institucionales."
      />

      <Alert variant="info" className="mb-6">
        Vista consolidada para alta gerencia. Los indicadores financieros reflejan ajustes
        registrados por el portal de Finanzas; el rendimiento académico considera calificaciones
        efectivas del portal docente.
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          label="Estudiantes activos"
          value={formatNumber(summary.activeStudents)}
          icon={<FiUsers size={18} />}
        />
        <StatCard
          label="Cursos ofertados"
          value={formatNumber(summary.coursesOffered)}
          icon={<FiBookOpen size={18} />}
        />
        <StatCard
          label="Ingresos por matrícula"
          value={formatCurrencyCRC(summary.tuitionIncome)}
          icon={<FiDollarSign size={18} />}
        />
        <StatCard
          label="Saldo pendiente"
          value={formatCurrencyCRC(summary.pendingBalance)}
          hint={`Morosidad ${formatPercentage(summary.delinquencyRate, 1)}`}
          icon={<FiAlertCircle size={18} />}
        />
        <StatCard
          label="Promedio académico general"
          value={formatGpa(summary.averageGpa)}
          icon={<FiTrendingUp size={18} />}
        />
        <StatCard
          label="Tasa de aprobación"
          value={formatPercentage(summary.passRate, 1)}
          hint={`${formatNumber(performance.approved)} aprobados`}
          icon={<FiTrendingUp size={18} />}
        />
      </div>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-text">Indicadores académicos</h2>
        <div className="grid gap-4 xl:grid-cols-2">
          <ExecutiveChartCard
            title="Estudiantes por estado"
            description="Distribución del estudiantado institucional."
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={studentsByStatusChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" name="Estudiantes" radius={[4, 4, 0, 0]}>
                  {studentsByStatusChart.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={
                        [EXECUTIVE_CHART_COLORS.primary, EXECUTIVE_CHART_COLORS.muted, EXECUTIVE_CHART_COLORS.accent][index]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ExecutiveChartCard>

          <ExecutiveChartCard
            title="Matrícula por período"
            description="Estudiantes únicos matriculados por período académico."
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={enrollmentByPeriod}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="periodName" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar
                  dataKey="count"
                  name="Estudiantes"
                  fill={EXECUTIVE_CHART_COLORS.primary}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ExecutiveChartCard>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          <ExecutiveChartCard
            title="Cursos por departamento"
            description="Oferta académica del período activo por unidad académica."
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={coursesByDepartment} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="department"
                  width={120}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Bar
                  dataKey="courseCount"
                  name="Cursos"
                  fill={EXECUTIVE_CHART_COLORS.accent}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ExecutiveChartCard>

          <article className="rounded-xl border border-primary/10 bg-card p-5 shadow-sm">
            <h3 className="text-base font-semibold text-text">Rendimiento académico general</h3>
            <p className="mt-1 text-sm text-muted">
              Consolidado del período activo con notas efectivas.
            </p>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-primary/10 px-4 py-3">
                <dt className="text-xs text-muted">Promedio general</dt>
                <dd className="mt-1 text-xl font-bold text-text">
                  {performance.averageGrade !== null
                    ? formatGrade(performance.averageGrade)
                    : '—'}
                </dd>
              </div>
              <div className="rounded-lg border border-primary/10 px-4 py-3">
                <dt className="text-xs text-muted">Tasa de aprobación</dt>
                <dd className="mt-1 text-xl font-bold text-text">
                  {formatPercentage(performance.passRate, 1)}
                </dd>
              </div>
              <div className="rounded-lg border border-primary/10 px-4 py-3">
                <dt className="text-xs text-muted">Aprobados</dt>
                <dd className="mt-1 text-lg font-semibold text-success">
                  {formatNumber(performance.approved)}
                </dd>
              </div>
              <div className="rounded-lg border border-primary/10 px-4 py-3">
                <dt className="text-xs text-muted">En riesgo / reprobados</dt>
                <dd className="mt-1 text-lg font-semibold text-danger">
                  {formatNumber(performance.failed)}
                </dd>
              </div>
            </dl>
          </article>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-text">Indicadores financieros</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total facturado" value={formatCurrencyCRC(financial.totalBilled)} />
          <StatCard label="Total pagado" value={formatCurrencyCRC(financial.totalPaid)} />
          <StatCard label="Total pendiente" value={formatCurrencyCRC(financial.totalPending)} />
          <StatCard
            label="Total vencido"
            value={formatCurrencyCRC(financial.totalOverdue)}
            hint={`${formatNumber(financial.studentsWithBalance)} estudiantes con saldo`}
          />
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          <FinancialBreakdownChart data={conceptBreakdown} />

          <ExecutiveChartCard
            title="Pagos por estado"
            description="Distribución de transacciones por estado de cobro."
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={paymentStatusBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatNumber(Number(value))} />
                <Tooltip formatter={(value) => formatCurrencyCRC(Number(value))} />
                <Legend />
                <Bar dataKey="amount" name="Monto" radius={[4, 4, 0, 0]}>
                  {paymentStatusBreakdown.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={
                        entry.status === 'pagado'
                          ? EXECUTIVE_CHART_COLORS.success
                          : entry.status === 'pendiente'
                            ? EXECUTIVE_CHART_COLORS.warning
                            : EXECUTIVE_CHART_COLORS.danger
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ExecutiveChartCard>
        </div>

        <div className="mt-4">
          <ExecutiveChartCard
            title="Tendencia de ingresos por período"
            description="Ingresos pagados consolidados por período académico."
          >
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="periodName" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatNumber(Number(value))} />
                <Tooltip formatter={(value) => formatCurrencyCRC(Number(value))} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  name="Ingresos"
                  stroke={EXECUTIVE_CHART_COLORS.primary}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ExecutiveChartCard>
        </div>
      </section>

      <section className="mt-8 grid gap-4 xl:grid-cols-2">
        <article className="rounded-xl border border-primary/10 bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-text">Top cursos por matrícula</h3>
          <Table
            columns={enrollmentColumns}
            data={topCourses.map((course) => ({ ...course, id: course.courseId }))}
          />
        </article>

        <article className="rounded-xl border border-primary/10 bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-text">Resumen financiero por estado</h3>
          <Table
            columns={paymentStatusColumns}
            data={paymentStatusBreakdown.map((item) => ({ ...item, id: item.status }))}
          />
        </article>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-2">
        <AcademicPerformanceTable
          title="Cursos con mejor rendimiento"
          courses={bestCourses}
          emptyMessage="Sin cursos evaluados con calificaciones finales."
        />
        <AcademicPerformanceTable
          title="Cursos en riesgo académico"
          courses={riskCourses}
          emptyMessage="No se detectaron cursos en riesgo."
        />
      </section>
    </PageShell>
  )
}
