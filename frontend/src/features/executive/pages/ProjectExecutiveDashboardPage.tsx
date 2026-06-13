import { useMemo } from 'react'
import {
  calculateMetricVariation,
  getChangeRequestSummary,
  getKpiStatusChartData,
  getOpenChangeRequestViewModels,
  getProjectExecutiveSummary,
  getProjectHealthByCategory,
  getProjectKpiComparisonChartData,
  getProjectMetricsByCategory,
  getProjectProgressTrend,
  getRiskLevelBreakdown,
  getRiskLevelChartData,
  getTopOpenRisks,
} from '@/data/selectors'
import { ChangeRequestsTable } from '@/features/executive/components/ChangeRequestsTable'
import { ExecutiveChartCard } from '@/features/executive/components/ExecutiveChartCard'
import { ExecutiveKpiCard } from '@/features/executive/components/ExecutiveKpiCard'
import { ProjectHealthPanel } from '@/features/executive/components/ProjectHealthPanel'
import { ProjectMetricsTable } from '@/features/executive/components/ProjectMetricsTable'
import { RisksTable } from '@/features/executive/components/RisksTable'
import { EXECUTIVE_CHART_COLORS, KPI_CATEGORY_LABELS } from '@/features/executive/constants'
import { Alert } from '@/components/feedback/Alert'
import { PageShell } from '@/components/layout/PageShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { formatNumber, formatPercentage } from '@/utils/formatters'
import {
  FiAlertTriangle,
  FiClock,
  FiDollarSign,
  FiGrid,
  FiTarget,
  FiTrendingUp,
} from 'react-icons/fi'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export function ProjectExecutiveDashboardPage() {
  const summary = useMemo(() => getProjectExecutiveSummary(), [])
  const metricsByCategory = useMemo(() => getProjectMetricsByCategory(), [])
  const health = useMemo(() => getProjectHealthByCategory(), [])
  const riskBreakdown = useMemo(() => getRiskLevelBreakdown(), [])
  const openRisks = useMemo(() => getTopOpenRisks(), [])
  const changeRequests = useMemo(() => getOpenChangeRequestViewModels(), [])
  const changeSummary = useMemo(() => getChangeRequestSummary(), [])
  const progressTrend = useMemo(() => getProjectProgressTrend(), [])
  const kpiStatusChart = useMemo(() => getKpiStatusChartData(), [])
  const riskLevelChart = useMemo(() => getRiskLevelChartData(), [])
  const comparisonChart = useMemo(() => getProjectKpiComparisonChartData(), [])

  const productivityMetrics = metricsByCategory.find((group) => group.category === 'productividad')
  const timeMetrics = metricsByCategory.find((group) => group.category === 'tiempo')

  return (
    <PageShell>
      <PageHeader
        title="Dashboard Ejecutivo del Proyecto"
        description="Seguimiento ejecutivo del avance, costo, calidad, productividad, riesgos y cambios del proyecto Plataforma Universitaria."
      />

      <Alert variant="info" className="mb-6">
        Panel de control del entregable de Administración de Proyectos. KPIs desde mockProjectMetrics;
        riesgos y cambios desde mockRisks.
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          label="Avance general"
          value={formatPercentage(summary.overallProgress, 0)}
          hint={timeMetrics?.metrics[0]?.name}
          icon={<FiTrendingUp size={18} />}
        />
        <StatCard
          label="Variación cronograma"
          value={`${formatNumber(summary.scheduleVariance)} días`}
          icon={<FiClock size={18} />}
        />
        <StatCard
          label="Variación de costo"
          value={formatPercentage(summary.costVariance, 1)}
          icon={<FiDollarSign size={18} />}
        />
        <StatCard
          label="KPIs críticos"
          value={formatNumber(summary.criticalKpis)}
          icon={<FiTarget size={18} />}
        />
        <StatCard
          label="Riesgos abiertos"
          value={formatNumber(summary.openRisks)}
          hint={`${formatNumber(riskBreakdown.rojo)} alto · ${formatNumber(riskBreakdown.amarillo)} medio`}
          icon={<FiAlertTriangle size={18} />}
        />
        <StatCard
          label="Cambios abiertos"
          value={formatNumber(summary.openChangeRequests)}
          hint={`${formatNumber(changeSummary.inReview)} en revisión`}
          icon={<FiGrid size={18} />}
        />
      </div>

      <div className="mt-8">
        <ProjectHealthPanel items={health} />
      </div>

      {metricsByCategory.map((group) => (
        <section key={group.category} className="mt-8">
          <h2 className="mb-1 text-lg font-semibold text-text">
            Dimensión: {KPI_CATEGORY_LABELS[group.category]}
          </h2>
          <p className="mb-4 text-sm text-muted">
            {group.metrics.length} indicador(es) de {group.label.toLowerCase()} del proyecto.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {group.metrics.map((metric) => (
              <ExecutiveKpiCard
                key={metric.id}
                name={metric.name}
                planned={metric.planned}
                actual={metric.actual}
                unit={metric.unit}
                status={metric.status}
                variation={calculateMetricVariation(metric)}
              />
            ))}
          </div>
        </section>
      ))}

      <section className="mt-8">
        <h2 className="mb-1 text-lg font-semibold text-text">Dimensión: Riesgos</h2>
        <p className="mb-4 text-sm text-muted">
          Seguimiento de riesgos abiertos del registro de proyecto (mockRisks).
        </p>
        <div className="mb-4 grid gap-4 sm:grid-cols-3">
          <StatCard label="Riesgo alto" value={formatNumber(riskBreakdown.rojo)} />
          <StatCard label="Riesgo medio" value={formatNumber(riskBreakdown.amarillo)} />
          <StatCard label="Riesgo bajo" value={formatNumber(riskBreakdown.verde)} />
        </div>
        <RisksTable risks={openRisks} />
      </section>

      <section className="mt-8 grid gap-4 xl:grid-cols-2">
        <ExecutiveChartCard
          title="Planificado vs real por dimensión"
          description="KPI principal de tiempo, costo, calidad y productividad."
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={comparisonChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="planificado" name="Planificado" fill={EXECUTIVE_CHART_COLORS.muted} radius={[4, 4, 0, 0]} />
              <Bar dataKey="real" name="Real" fill={EXECUTIVE_CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ExecutiveChartCard>

        <ExecutiveChartCard
          title="KPIs por estado"
          description="Distribución del semáforo de indicadores (mockProjectMetrics)."
        >
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={kpiStatusChart}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
              >
                {kpiStatusChart.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={
                      [EXECUTIVE_CHART_COLORS.success, EXECUTIVE_CHART_COLORS.warning, EXECUTIVE_CHART_COLORS.danger][index]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ExecutiveChartCard>

        <ExecutiveChartCard
          title="Riesgos por nivel"
          description="Riesgos abiertos clasificados por severidad."
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={riskLevelChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" name="Riesgos" radius={[4, 4, 0, 0]}>
                {riskLevelChart.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={
                      [EXECUTIVE_CHART_COLORS.success, EXECUTIVE_CHART_COLORS.warning, EXECUTIVE_CHART_COLORS.danger][index]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ExecutiveChartCard>

        <ExecutiveChartCard
          title="Avance por fase"
          description="Tendencia planificado vs real (mockProjectProgressTrend)."
        >
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={progressTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="phase" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} unit="%" />
              <Tooltip formatter={(value) => formatPercentage(Number(value), 0)} />
              <Legend />
              <Area
                type="monotone"
                dataKey="planned"
                name="Planificado"
                stroke={EXECUTIVE_CHART_COLORS.muted}
                fill={EXECUTIVE_CHART_COLORS.muted}
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="actual"
                name="Real"
                stroke={EXECUTIVE_CHART_COLORS.primary}
                fill={EXECUTIVE_CHART_COLORS.primary}
                fillOpacity={0.25}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ExecutiveChartCard>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-text">Detalle de KPIs por dimensión</h2>
        <ProjectMetricsTable categories={metricsByCategory} />
      </section>

      {productivityMetrics ? (
        <section className="mt-8 rounded-xl border border-primary/10 bg-card p-5 shadow-sm">
          <h3 className="text-base font-semibold text-text">Productividad del equipo</h3>
          <p className="mt-1 text-sm text-muted">
            {productivityMetrics.metrics.map((m) => m.name).join(' · ')}
          </p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {productivityMetrics.metrics.map((metric) => (
              <div key={metric.id} className="rounded-lg border border-primary/10 px-4 py-3">
                <dt className="text-xs text-muted">{metric.name}</dt>
                <dd className="mt-1 text-lg font-semibold text-text">
                  {formatNumber(metric.actual)} / {formatNumber(metric.planned)} {metric.unit}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-text">Solicitudes de cambio</h2>
        <ChangeRequestsTable requests={changeRequests} />
      </section>
    </PageShell>
  )
}
