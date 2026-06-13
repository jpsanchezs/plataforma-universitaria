import type { PaymentConcept, PaymentStatus } from '@/types/finance'
import type { ChangeRequest, KpiCategory, ProjectMetric, Risk, RiskLevel } from '@/types/project'
import type { ID } from '@/types/common'

export interface ExecutiveAcademicSummary {
  activeStudents: number
  coursesOffered: number
  tuitionIncome: number
  pendingBalance: number
  averageGpa: number
  passRate: number
  delinquencyRate: number
}

export interface StudentsByStatusSummary {
  activo: number
  inactivo: number
  graduado: number
}

export interface EnrollmentCountByPeriod {
  periodId: ID
  periodName: string
  count: number
}

export interface CourseEnrollmentRankItem {
  courseId: ID
  courseCode: string
  courseName: string
  teacherName: string
  enrollmentCount: number
}

export interface CoursePerformanceItem {
  courseId: ID
  courseCode: string
  courseName: string
  averageGrade: number
  passRate: number
  atRiskCount: number
  studentCount: number
}

export interface AcademicPerformanceSummary {
  averageGrade: number | null
  passRate: number
  totalEvaluated: number
  approved: number
  failed: number
  inProgress: number
}

export interface FinancialBreakdownItem {
  concept: PaymentConcept
  label: string
  totalBilled: number
  totalPaid: number
}

export interface PaymentStatusBreakdownItem {
  status: PaymentStatus
  label: string
  count: number
  amount: number
}

export interface ExecutiveFinancialSummary {
  totalBilled: number
  totalPaid: number
  totalPending: number
  totalOverdue: number
  delinquencyRate: number
  studentsWithBalance: number
  tuitionIncome: number
}

export interface RevenueTrendPoint {
  periodName: string
  amount: number
}

export interface CoursesByDepartmentItem {
  department: string
  courseCount: number
}

export interface ProjectExecutiveSummary {
  overallProgress: number
  scheduleVariance: number
  costVariance: number
  criticalKpis: number
  openRisks: number
  openChangeRequests: number
}

export interface ProjectMetricsByCategory {
  category: KpiCategory
  label: string
  metrics: ProjectMetric[]
}

export interface ProjectMetricsStatusBreakdown {
  verde: number
  amarillo: number
  rojo: number
}

export interface ProjectHealthItem {
  category: KpiCategory | 'riesgos'
  label: string
  status: RiskLevel
}

export interface RiskLevelBreakdown {
  verde: number
  amarillo: number
  rojo: number
}

export interface ChangeRequestSummary {
  total: number
  open: number
  inReview: number
  approved: number
  rejected: number
}

export interface ChangeRequestViewModel extends ChangeRequest {
  scopeImpact: 'bajo' | 'medio' | 'alto'
  timeImpact: 'bajo' | 'medio' | 'alto'
  costImpact: 'bajo' | 'medio' | 'alto'
  recommendation: string
}

export interface ProjectProgressTrendPoint {
  phase: string
  planned: number
  actual: number
}

export interface ChartSeriesPoint {
  name: string
  value: number
}

export interface KpiComparisonChartPoint {
  name: string
  planificado: number
  real: number
  unit: string
}

export interface ProjectKpiComparisonItem {
  name: string
  planned: number
  actual: number
  unit: string
}

export interface OpenRiskViewModel extends Risk {
  responseStrategy: string
}
