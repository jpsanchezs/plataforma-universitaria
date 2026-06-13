import type { ID, ISODateString } from '@/types/common'
import type {
  AcademicHistoryItem,
  AcademicPeriod,
  AttendanceRecord,
  AttendanceStatus,
  Course,
  DayOfWeek,
  Enrollment,
  Grade,
  ScheduleBlock,
  Student,
  Teacher,
} from '@/types/academic'
import type {
  AccountSummary,
  AcademicKpi,
  FinancialKpi,
  Payment,
} from '@/types/finance'
import type { ChangeRequest, KpiCategory, ProjectKpi, ProjectMetric, RiskLevel } from '@/types/project'
import type { StudentEnrollmentOverrides } from '@/features/student/types'
import type {
  TeacherAttendanceStorage,
  TeacherGradesStorage,
} from '@/features/teacher/types'
import {
  attendanceStorageKey,
  gradeStorageKey,
} from '@/features/teacher/types'
import { mockAcademicHistory } from '@/data/mockAcademicHistory'
import { mockAttendance } from '@/data/mockAttendance'
import { mockChangeRequests, mockRisks } from '@/data/mockRisks'
import { mockCourses } from '@/data/mockCourses'
import { mockEnrollments } from '@/data/mockEnrollments'
import { mockGrades } from '@/data/mockGrades'
import { CURRENT_PERIOD_ID, mockPeriods } from '@/data/mockPeriods'
import { mockPayments } from '@/data/mockPayments'
import { mockProjectMetrics, mockProjectProgressTrend } from '@/data/mockProjectMetrics'
import { mockSchedules } from '@/data/mockSchedules'
import { mockStudents } from '@/data/mockStudents'
import { mockTeachers } from '@/data/mockTeachers'
import type {
  AdminCoursesStorage,
  AdminPeriodsStorage,
  AdminStudentsStorage,
  AdminTeachersSummary,
  AdminTeachersStorage,
  AdminCoursesSummary,
  AdminPeriodsSummary,
  AdminStudentsSummary,
} from '@/features/admin/types'
import {
  emptyAdminCoursesStorage,
  emptyAdminPeriodsStorage,
  emptyAdminStudentsStorage,
  emptyAdminTeachersStorage,
} from '@/features/admin/types'
import type {
  FinancePaymentViewModel,
  FinancePaymentsStorage,
  FinanceSummary,
  PaymentConceptTotals,
  PaymentHistorySummary,
} from '@/features/finance/types'
import { emptyFinancePaymentsStorage } from '@/features/finance/types'
import type {
  AcademicPerformanceSummary,
  ChangeRequestSummary,
  ChangeRequestViewModel,
  CourseEnrollmentRankItem,
  CoursePerformanceItem,
  CoursesByDepartmentItem,
  EnrollmentCountByPeriod,
  ExecutiveAcademicSummary,
  ExecutiveFinancialSummary,
  FinancialBreakdownItem,
  OpenRiskViewModel,
  PaymentStatusBreakdownItem,
  ProjectExecutiveSummary,
  ProjectHealthItem,
  ProjectKpiComparisonItem,
  ProjectMetricsByCategory,
  ProjectMetricsStatusBreakdown,
  ProjectProgressTrendPoint,
  RevenueTrendPoint,
  RiskLevelBreakdown,
  StudentsByStatusSummary,
  ChartSeriesPoint,
  KpiComparisonChartPoint,
} from '@/features/executive/types'
import {
  KPI_CATEGORY_LABELS,
  PAYMENT_CONCEPT_LABELS,
} from '@/features/executive/constants'
import { PASSING_GRADE } from '@/features/student/constants'

const DAY_ORDER: Record<string, number> = {
  Domingo: 0,
  Lunes: 1,
  Martes: 2,
  Miércoles: 3,
  Jueves: 4,
  Viernes: 5,
  Sábado: 6,
}

export const WEEK_DAYS: DayOfWeek[] = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
]

export interface StudentEnrollmentSummary {
  enrolledCourses: Course[]
  totalCredits: number
  courseCount: number
  period: AcademicPeriod | undefined
}

export interface StudentAcademicSummary {
  averageGrade: number | null
  approvedCourses: number
  inProgressCourses: number
  atRiskCourses: number
  bestGrade: number | null
}

export interface StudentFinancialSummary extends AccountSummary {
  nextDueDate: string | null
}

export interface CourseWithEnrollmentMeta extends Course {
  teacherName: string
  scheduleSummary: string
  availableSeats: number
}

function emptyOverrides(): StudentEnrollmentOverrides {
  return { addedCourseIds: [], removedCourseIds: [] }
}

export function getCourseById(courseId: ID): Course | undefined {
  return mockCourses.find((course) => course.id === courseId)
}

export function getPeriodById(periodId: ID): AcademicPeriod | undefined {
  return mockPeriods.find((period) => period.id === periodId)
}

export function getTeacherNameById(teacherId: ID): string {
  return mockTeachers.find((teacher) => teacher.id === teacherId)?.fullName ?? 'Sin asignar'
}

export function getBaseEnrollmentsForStudent(
  studentId: ID,
  periodId: ID = CURRENT_PERIOD_ID,
): Enrollment[] {
  return mockEnrollments.filter(
    (enrollment) =>
      enrollment.studentId === studentId &&
      enrollment.periodId === periodId &&
      enrollment.status === 'matriculado',
  )
}

export function getEffectiveEnrollments(
  studentId: ID,
  overrides: StudentEnrollmentOverrides = emptyOverrides(),
  periodId: ID = CURRENT_PERIOD_ID,
): Enrollment[] {
  const base = getBaseEnrollmentsForStudent(studentId, periodId).filter(
    (enrollment) => !overrides.removedCourseIds.includes(enrollment.courseId),
  )

  const added: Enrollment[] = overrides.addedCourseIds
    .filter(
      (courseId) =>
        !base.some((enrollment) => enrollment.courseId === courseId) &&
        !overrides.removedCourseIds.includes(courseId),
    )
    .map((courseId, index) => ({
      id: `local-enr-${studentId}-${courseId}-${index}`,
      studentId,
      courseId,
      periodId,
      status: 'matriculado' as const,
      enrolledAt: new Date().toISOString().slice(0, 10),
    }))

  return [...base, ...added]
}

export function getEffectiveCourseIds(
  studentId: ID,
  overrides: StudentEnrollmentOverrides = emptyOverrides(),
  periodId: ID = CURRENT_PERIOD_ID,
): ID[] {
  return getEffectiveEnrollments(studentId, overrides, periodId).map(
    (enrollment) => enrollment.courseId,
  )
}

export function getCoursesByCourseIds(courseIds: ID[]): Course[] {
  return mockCourses.filter((course) => courseIds.includes(course.id))
}

export function getCourseScheduleSummary(courseId: ID): string {
  const blocks = mockSchedules.filter((block) => block.courseId === courseId)
  if (blocks.length === 0) {
    return 'Horario por confirmar'
  }

  const dayAbbrev: Record<DayOfWeek, string> = {
    Lunes: 'Lun',
    Martes: 'Mar',
    Miércoles: 'Mié',
    Jueves: 'Jue',
    Viernes: 'Vie',
    Sábado: 'Sáb',
  }

  return blocks
    .map((block) => `${dayAbbrev[block.day]} ${block.startTime}-${block.endTime}`)
    .join(' · ')
}

export function getAvailableSeats(course: Course, overrides?: StudentEnrollmentOverrides): number {
  const extraEnrollments =
    overrides?.addedCourseIds.filter((id) => id === course.id).length ?? 0
  return Math.max(course.capacity - course.enrolled - extraEnrollments, 0)
}

export function getAvailableCoursesForStudent(
  studentId: ID,
  overrides: StudentEnrollmentOverrides = emptyOverrides(),
  periodId: ID = CURRENT_PERIOD_ID,
): CourseWithEnrollmentMeta[] {
  const enrolledIds = new Set(getEffectiveCourseIds(studentId, overrides, periodId))

  return mockCourses
    .filter((course) => course.periodId === periodId && course.status === 'activo')
    .map((course) => ({
      ...course,
      teacherName: getTeacherNameById(course.teacherId),
      scheduleSummary: getCourseScheduleSummary(course.id),
      availableSeats: getAvailableSeats(course, overrides),
    }))
    .filter((course) => !enrolledIds.has(course.id))
}

export function getEnrolledCoursesForStudent(
  studentId: ID,
  overrides: StudentEnrollmentOverrides = emptyOverrides(),
  periodId: ID = CURRENT_PERIOD_ID,
): CourseWithEnrollmentMeta[] {
  const courseIds = getEffectiveCourseIds(studentId, overrides, periodId)
  return getCoursesByCourseIds(courseIds).map((course) => ({
    ...course,
    teacherName: getTeacherNameById(course.teacherId),
    scheduleSummary: getCourseScheduleSummary(course.id),
    availableSeats: getAvailableSeats(course, overrides),
  }))
}

export function getStudentEnrollmentSummary(
  studentId: ID,
  overrides: StudentEnrollmentOverrides = emptyOverrides(),
  periodId: ID = CURRENT_PERIOD_ID,
): StudentEnrollmentSummary {
  const enrolledCourses = getEnrolledCoursesForStudent(studentId, overrides, periodId)
  return {
    enrolledCourses,
    totalCredits: enrolledCourses.reduce((sum, course) => sum + course.credits, 0),
    courseCount: enrolledCourses.length,
    period: getPeriodById(periodId),
  }
}

export function getScheduleByCourseIds(courseIds: ID[]): ScheduleBlock[] {
  return mockSchedules.filter((block) => courseIds.includes(block.courseId))
}

export function getScheduleByStudentId(
  studentId: ID,
  overrides: StudentEnrollmentOverrides = emptyOverrides(),
  periodId: ID = CURRENT_PERIOD_ID,
): ScheduleBlock[] {
  const courseIds = getEffectiveCourseIds(studentId, overrides, periodId)
  return getScheduleByCourseIds(courseIds)
}

export function getGradesByStudentAndCourses(
  studentId: ID,
  courseIds: ID[],
): Grade[] {
  return mockGrades.filter(
    (grade) => grade.studentId === studentId && courseIds.includes(grade.courseId),
  )
}

export function getGradeForCourse(studentId: ID, courseId: ID): Grade | undefined {
  return mockGrades.find(
    (grade) => grade.studentId === studentId && grade.courseId === courseId,
  )
}

export function computeGradeStatus(grade: Grade | undefined): 'aprobado' | 'reprobado' | 'en_curso' | 'pendiente' {
  if (!grade) {
    return 'pendiente'
  }
  if (grade.finalGrade !== null) {
    return grade.finalGrade >= PASSING_GRADE ? 'aprobado' : 'reprobado'
  }
  const partials = [grade.partial1, grade.partial2, grade.finalExam].filter(
    (value): value is number => value !== null,
  )
  if (partials.length === 0) {
    return 'pendiente'
  }
  const average = partials.reduce((sum, value) => sum + value, 0) / partials.length
  if (average < PASSING_GRADE && grade.partial2 !== null) {
    return 'reprobado'
  }
  return 'en_curso'
}

export interface EffectiveGradeValues {
  partial1: number | null
  partial2: number | null
  finalExam: number | null
  finalGrade: number | null
}

export function getEffectiveGradeValues(
  studentId: ID,
  courseId: ID,
  gradeOverrides: TeacherGradesStorage = {},
): EffectiveGradeValues {
  const base = getGradeForCourse(studentId, courseId)
  const override = gradeOverrides[gradeStorageKey(courseId, studentId)] ?? {}

  const partial1 =
    override.partial1 !== undefined ? override.partial1 : (base?.partial1 ?? null)
  const partial2 =
    override.partial2 !== undefined ? override.partial2 : (base?.partial2 ?? null)
  const finalExam =
    override.finalExam !== undefined ? override.finalExam : (base?.finalExam ?? null)
  const finalGrade = calculateFinalGrade(partial1, partial2, finalExam)

  return { partial1, partial2, finalExam, finalGrade }
}

export function getEffectiveAttendanceStatus(
  courseId: ID,
  studentId: ID,
  date: ISODateString,
  attendanceOverrides: TeacherAttendanceStorage = {},
): AttendanceStatus {
  const override = attendanceOverrides[attendanceStorageKey(courseId, studentId, date)]
  if (override) {
    return override
  }
  return getBaseAttendanceStatus(courseId, studentId, date) ?? 'presente'
}

export function getStudentAcademicSummary(
  studentId: ID,
  overrides: StudentEnrollmentOverrides = emptyOverrides(),
  periodId: ID = CURRENT_PERIOD_ID,
  gradeOverrides: TeacherGradesStorage = {},
): StudentAcademicSummary {
  const courseIds = getEffectiveCourseIds(studentId, overrides, periodId)
  const statuses = courseIds.map((courseId) => {
    const values = getEffectiveGradeValues(studentId, courseId, gradeOverrides)
    return computeGradeDisplayStatus(
      values.partial1,
      values.partial2,
      values.finalExam,
      values.finalGrade,
    )
  })

  const gradeValues = courseIds.flatMap((courseId) => {
    const values = getEffectiveGradeValues(studentId, courseId, gradeOverrides)
    return [values.partial1, values.partial2, values.finalExam, values.finalGrade].filter(
      (value): value is number => value !== null,
    )
  })

  const bestGrade = gradeValues.length > 0 ? Math.max(...gradeValues) : null
  const averageGrade =
    gradeValues.length > 0
      ? gradeValues.reduce((sum, value) => sum + value, 0) / gradeValues.length
      : null

  return {
    averageGrade,
    approvedCourses: statuses.filter((status) => status === 'aprobado').length,
    inProgressCourses: statuses.filter((status) => status === 'en_curso' || status === 'pendiente').length,
    atRiskCourses: statuses.filter((status) => status === 'reprobado').length,
    bestGrade,
  }
}

export function getStudentFinancialSummary(
  studentId: ID,
  paymentOverrides: FinancePaymentsStorage = emptyFinancePaymentsStorage(),
): StudentFinancialSummary {
  const summary = getAccountSummaryByStudentId(studentId, paymentOverrides)
  const pendingPayments = getPaymentsByStudentId(studentId, paymentOverrides)
    .filter((payment) => payment.status === 'pendiente' || payment.status === 'vencido')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))

  return {
    ...summary,
    nextDueDate: pendingPayments[0]?.dueDate ?? null,
  }
}

export function getAcademicHistoryByStudentId(studentId: ID): AcademicHistoryItem[] {
  return mockAcademicHistory.filter((item) => item.studentId === studentId)
}

export function getAcademicHistorySummary(studentId: ID) {
  const history = getAcademicHistoryByStudentId(studentId)
  const approved = history.filter((item) => item.status === 'aprobado')
  const failed = history.filter((item) => item.status === 'reprobado')
  const approvedCredits = approved.reduce((sum, item) => sum + item.credits, 0)
  const average =
    history.length > 0
      ? history.reduce((sum, item) => sum + item.finalGrade, 0) / history.length
      : null

  return {
    approvedCredits,
    averageGrade: average,
    approvedCount: approved.length,
    failedCount: failed.length,
    items: history,
  }
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function schedulesOverlap(
  blockA: ScheduleBlock,
  blockB: ScheduleBlock,
): boolean {
  if (blockA.day !== blockB.day) {
    return false
  }
  return (
    timeToMinutes(blockA.startTime) < timeToMinutes(blockB.endTime) &&
    timeToMinutes(blockB.startTime) < timeToMinutes(blockA.endTime)
  )
}

export function hasScheduleConflict(
  studentId: ID,
  courseId: ID,
  overrides: StudentEnrollmentOverrides = emptyOverrides(),
  periodId: ID = CURRENT_PERIOD_ID,
): boolean {
  const newBlocks = getScheduleByCourseIds([courseId])
  const enrolledIds = getEffectiveCourseIds(studentId, overrides, periodId)
  const existingBlocks = getScheduleByCourseIds(enrolledIds)

  return newBlocks.some((newBlock) =>
    existingBlocks.some((existingBlock) => schedulesOverlap(newBlock, existingBlock)),
  )
}

// --- Existing exports below (updated where needed) ---

export function getStudentByUserId(userId: ID): Student | undefined {
  return mockStudents.find((student) => student.userId === userId)
}

export function getStudentById(studentId: ID): Student | undefined {
  return mockStudents.find((student) => student.id === studentId)
}

export function getTeacherByUserId(userId: ID): Teacher | undefined {
  return mockTeachers.find((teacher) => teacher.userId === userId)
}

export function getTeacherById(teacherId: ID): Teacher | undefined {
  return mockTeachers.find((teacher) => teacher.id === teacherId)
}

export function getCoursesByStudentId(
  studentId: ID,
  periodId: ID = CURRENT_PERIOD_ID,
): Course[] {
  const courseIds = getBaseEnrollmentsForStudent(studentId, periodId).map(
    (enrollment) => enrollment.courseId,
  )
  return mockCourses.filter((course) => courseIds.includes(course.id))
}

export function getCoursesByTeacherId(
  teacherId: ID,
  periodId: ID = CURRENT_PERIOD_ID,
): Course[] {
  return mockCourses.filter(
    (course) => course.teacherId === teacherId && course.periodId === periodId,
  )
}

export function getEnrollmentsByStudentId(
  studentId: ID,
  periodId: ID = CURRENT_PERIOD_ID,
): Enrollment[] {
  return getBaseEnrollmentsForStudent(studentId, periodId)
}

export function getGradesByStudentId(studentId: ID): Grade[] {
  return mockGrades.filter((grade) => grade.studentId === studentId)
}

export function getPaymentsByStudentId(
  studentId: ID,
  paymentOverrides: FinancePaymentsStorage = emptyFinancePaymentsStorage(),
): Payment[] {
  return getEffectivePayments(paymentOverrides).filter(
    (payment) => payment.studentId === studentId,
  )
}

export function getAccountSummaryByStudentId(
  studentId: ID,
  paymentOverrides: FinancePaymentsStorage = emptyFinancePaymentsStorage(),
): AccountSummary {
  const payments = getPaymentsByStudentId(studentId, paymentOverrides)
  const totalPaid = payments
    .filter((payment) => payment.status === 'pagado')
    .reduce((sum, payment) => sum + payment.amount, 0)
  const totalPending = payments
    .filter((payment) => payment.status === 'pendiente')
    .reduce((sum, payment) => sum + payment.amount, 0)
  const overdueAmount = payments
    .filter((payment) => payment.status === 'vencido')
    .reduce((sum, payment) => sum + payment.amount, 0)

  return {
    studentId,
    balance: totalPending + overdueAmount,
    totalPaid,
    totalPending,
    overdueAmount,
    currency: 'CRC',
  }
}

export function getActiveStudentsCount(): number {
  return mockStudents.filter((student) => student.status === 'activo').length
}

export function getCurrentAcademicPeriod(): AcademicPeriod | undefined {
  return mockPeriods.find((period) => period.status === 'activo')
}

export function getCoursesInCurrentPeriod(): Course[] {
  return mockCourses.filter((course) => course.periodId === CURRENT_PERIOD_ID)
}

export function getTeachersCount(): number {
  return mockTeachers.filter((teacher) => teacher.status === 'activo').length
}

export function getTotalEnrollmentIncome(): number {
  return mockPayments
    .filter(
      (payment) =>
        payment.concept === 'matricula' &&
        payment.status === 'pagado' &&
        payment.periodId === CURRENT_PERIOD_ID,
    )
    .reduce((sum, payment) => sum + payment.amount, 0)
}

export function getPendingPaymentsTotal(): number {
  return mockPayments
    .filter((payment) => payment.status === 'pendiente')
    .reduce((sum, payment) => sum + payment.amount, 0)
}

export function getOverduePaymentsCount(): number {
  return mockPayments.filter((payment) => payment.status === 'vencido').length
}

export function getStudentsWithPendingBalanceCount(): number {
  const studentIds = new Set(
    mockPayments
      .filter(
        (payment) =>
          payment.status === 'pendiente' || payment.status === 'vencido',
      )
      .map((payment) => payment.studentId),
  )
  return studentIds.size
}

export function getAverageGpa(): number {
  const activeStudents = mockStudents.filter((student) => student.status === 'activo')
  if (activeStudents.length === 0) {
    return 0
  }
  const total = activeStudents.reduce((sum, student) => sum + student.gpa, 0)
  return total / activeStudents.length
}

export function getAverageGradeByStudentId(studentId: ID): number | null {
  const grades = getGradesByStudentId(studentId)
  const values = grades.flatMap((grade) =>
    [grade.partial1, grade.partial2, grade.finalExam, grade.finalGrade].filter(
      (value): value is number => value !== null,
    ),
  )
  if (values.length === 0) {
    return null
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export function getNextScheduleBlock(
  studentId: ID,
  overrides: StudentEnrollmentOverrides = emptyOverrides(),
  referenceDate: Date = new Date('2026-02-09T07:00:00'),
): (ScheduleBlock & { courseName: string; courseCode: string; teacherName: string }) | null {
  const blocks = getScheduleByStudentId(studentId, overrides)
  const refDay = referenceDate.getDay()
  const refMinutes = referenceDate.getHours() * 60 + referenceDate.getMinutes()

  const enriched = blocks
    .map((block) => {
      const course = getCourseById(block.courseId)
      const [startHour, startMinute] = block.startTime.split(':').map(Number)
      const blockDay = DAY_ORDER[block.day] ?? 0
      const blockMinutes = startHour * 60 + startMinute
      let dayDiff = blockDay - refDay
      if (dayDiff < 0 || (dayDiff === 0 && blockMinutes <= refMinutes)) {
        dayDiff += 7
      }
      return {
        ...block,
        courseName: course?.name ?? 'Curso',
        courseCode: course?.code ?? '—',
        teacherName: course ? getTeacherNameById(course.teacherId) : '—',
        sortKey: dayDiff * 1440 + blockMinutes,
      }
    })
    .sort((a, b) => a.sortKey - b.sortKey)

  return enriched[0] ?? null
}

export function getStudentsCountByTeacherId(teacherId: ID): number {
  const courseIds = getCoursesByTeacherId(teacherId).map((course) => course.id)
  const studentIds = new Set(
    mockEnrollments
      .filter(
        (enrollment) =>
          courseIds.includes(enrollment.courseId) &&
          enrollment.status === 'matriculado',
      )
      .map((enrollment) => enrollment.studentId),
  )
  return studentIds.size
}

export function getPendingAttendanceCountByTeacherId(teacherId: ID): number {
  const courseIds = getCoursesByTeacherId(teacherId).map((course) => course.id)
  return mockAttendance.filter(
    (record) => courseIds.includes(record.courseId) && !record.registered,
  ).length
}

export function getPendingGradesCountByTeacherId(teacherId: ID): number {
  const courseIds = getCoursesByTeacherId(teacherId).map((course) => course.id)
  return mockGrades.filter(
    (grade) =>
      courseIds.includes(grade.courseId) &&
      (grade.partial2 === null || grade.finalExam === null),
  ).length
}

export function getDelinquencyRate(): number {
  const totalPayments = mockPayments.length
  const overdueOrPending = mockPayments.filter(
    (payment) => payment.status === 'vencido' || payment.status === 'pendiente',
  ).length
  if (totalPayments === 0) {
    return 0
  }
  return (overdueOrPending / totalPayments) * 100
}

export function getAcademicKpis(): AcademicKpi[] {
  const period = getCurrentAcademicPeriod()
  return [
    {
      label: 'Estudiantes activos',
      value: getActiveStudentsCount(),
    },
    {
      label: 'Promedio académico general',
      value: getAverageGpa().toFixed(2),
    },
    {
      label: 'Cursos en período actual',
      value: getCoursesInCurrentPeriod().length,
      unit: period?.name,
    },
    {
      label: 'Tasa de aprobación estimada',
      value: '87',
      unit: '%',
    },
  ]
}

export function getFinancialKpis(): FinancialKpi[] {
  return [
    {
      label: 'Ingresos por matrícula',
      value: getTotalEnrollmentIncome(),
      unit: 'CRC',
    },
    {
      label: 'Pagos pendientes',
      value: getPendingPaymentsTotal(),
      unit: 'CRC',
    },
    {
      label: 'Morosidad',
      value: getDelinquencyRate().toFixed(1),
      unit: '%',
    },
    {
      label: 'Estudiantes con saldo',
      value: getStudentsWithPendingBalanceCount(),
    },
  ]
}

export function getProjectKpis(): ProjectKpi[] {
  const metrics = mockProjectMetrics
  const avgProgress =
    metrics.reduce((sum, metric) => sum + (metric.actual / metric.planned) * 100, 0) /
    metrics.length
  const criticalKpis = metrics.filter((metric) => metric.status === 'rojo').length
  const warningKpis = metrics.filter((metric) => metric.status === 'amarillo').length

  return [
    {
      label: 'Avance promedio del proyecto',
      value: avgProgress.toFixed(1),
      unit: '%',
      status: avgProgress >= 70 ? 'verde' : 'amarillo',
    },
    {
      label: 'KPIs en rojo',
      value: criticalKpis,
      status: 'rojo',
    },
    {
      label: 'KPIs en amarillo',
      value: warningKpis,
      status: 'amarillo',
    },
    {
      label: 'Solicitudes de cambio abiertas',
      value: mockChangeRequests.filter(
        (request) => request.status === 'abierta' || request.status === 'en_revision',
      ).length,
      status: 'amarillo',
    },
  ]
}

export function getOpenRisks() {
  return mockRisks.filter((risk) => risk.open)
}

export function getOpenChangeRequests() {
  return mockChangeRequests.filter(
    (request) => request.status === 'abierta' || request.status === 'en_revision',
  )
}

export function getEnrollmentsByCourseId(courseId: ID): Enrollment[] {
  return mockEnrollments.filter(
    (enrollment) =>
      enrollment.courseId === courseId && enrollment.status === 'matriculado',
  )
}

export function getStudentsByCourseId(courseId: ID): Student[] {
  const studentIds = getEnrollmentsByCourseId(courseId).map(
    (enrollment) => enrollment.studentId,
  )
  return mockStudents.filter((student) => studentIds.includes(student.id))
}

export function getCourseEnrollmentCount(courseId: ID): number {
  return getEnrollmentsByCourseId(courseId).length
}

export function getStudentEnrollmentCount(
  studentId: ID,
  periodId: ID = CURRENT_PERIOD_ID,
): number {
  return getBaseEnrollmentsForStudent(studentId, periodId).length
}

export function courseHasEnrollments(courseId: ID): boolean {
  return getCourseEnrollmentCount(courseId) > 0
}

export function getScheduleByCourseId(courseId: ID): ScheduleBlock[] {
  return getScheduleByCourseIds([courseId])
}

export interface CourseTeacherSummary {
  courseCount: number
  totalStudents: number
  totalCredits: number
  period: AcademicPeriod | undefined
}

export function getCourseTeacherSummary(
  teacherId: ID,
  periodId: ID = CURRENT_PERIOD_ID,
): CourseTeacherSummary {
  const courses = getCoursesByTeacherId(teacherId, periodId)
  const studentIds = new Set<ID>()

  courses.forEach((course) => {
    getEnrollmentsByCourseId(course.id).forEach((enrollment) => {
      studentIds.add(enrollment.studentId)
    })
  })

  return {
    courseCount: courses.length,
    totalStudents: studentIds.size,
    totalCredits: courses.reduce((sum, course) => sum + course.credits, 0),
    period: getPeriodById(periodId),
  }
}

export function getGradesByCourseId(courseId: ID): Grade[] {
  return mockGrades.filter((grade) => grade.courseId === courseId)
}

export function getAttendanceByCourseAndDate(
  courseId: ID,
  date: ISODateString,
): AttendanceRecord[] {
  return mockAttendance.filter(
    (record) => record.courseId === courseId && record.date === date,
  )
}

export function calculateFinalGrade(
  partial1: number | null,
  partial2: number | null,
  finalExam: number | null,
): number | null {
  if (partial1 === null || partial2 === null || finalExam === null) {
    return null
  }
  return partial1 * 0.3 + partial2 * 0.3 + finalExam * 0.4
}

export function computeGradeDisplayStatus(
  partial1: number | null,
  partial2: number | null,
  finalExam: number | null,
  finalGrade: number | null,
): 'aprobado' | 'reprobado' | 'en_curso' | 'pendiente' {
  if (partial1 === null && partial2 === null && finalExam === null) {
    return 'pendiente'
  }
  if (finalGrade === null) {
    return 'en_curso'
  }
  return finalGrade >= PASSING_GRADE ? 'aprobado' : 'reprobado'
}

export function getBaseAttendanceStatus(
  courseId: ID,
  studentId: ID,
  date: ISODateString,
): AttendanceStatus | null {
  const record = mockAttendance.find(
    (item) =>
      item.courseId === courseId &&
      item.studentId === studentId &&
      item.date === date,
  )
  return record?.status ?? null
}

export function teacherOwnsCourse(teacherId: ID, courseId: ID): boolean {
  const course = getCourseById(courseId)
  return course?.teacherId === teacherId
}

function mergeAdminEntities<T extends { id: ID }>(
  base: T[],
  storage: { created: T[]; updated: Record<ID, Partial<T>> },
): T[] {
  const mergedBase = base.map((item) => ({
    ...item,
    ...(storage.updated[item.id] ?? {}),
  }))
  return [...mergedBase, ...storage.created]
}

export function getEffectiveStudents(
  storage: AdminStudentsStorage = emptyAdminStudentsStorage(),
): Student[] {
  return mergeAdminEntities(mockStudents, storage)
}

export function getEffectiveTeachers(
  storage: AdminTeachersStorage = emptyAdminTeachersStorage(),
): Teacher[] {
  return mergeAdminEntities(mockTeachers, storage)
}

export function getEffectiveCourses(
  storage: AdminCoursesStorage = emptyAdminCoursesStorage(),
): Course[] {
  return mergeAdminEntities(mockCourses, storage)
}

export function getEffectivePeriods(
  storage: AdminPeriodsStorage = emptyAdminPeriodsStorage(),
): AcademicPeriod[] {
  return mergeAdminEntities(mockPeriods, storage)
}

export function getEffectiveStudentById(
  studentId: ID,
  storage: AdminStudentsStorage = emptyAdminStudentsStorage(),
): Student | undefined {
  return getEffectiveStudents(storage).find((student) => student.id === studentId)
}

export function getEffectiveTeacherById(
  teacherId: ID,
  storage: AdminTeachersStorage = emptyAdminTeachersStorage(),
): Teacher | undefined {
  return getEffectiveTeachers(storage).find((teacher) => teacher.id === teacherId)
}

export function getEffectiveCourseById(
  courseId: ID,
  storage: AdminCoursesStorage = emptyAdminCoursesStorage(),
): Course | undefined {
  return getEffectiveCourses(storage).find((course) => course.id === courseId)
}

export function getEffectivePeriodById(
  periodId: ID,
  storage: AdminPeriodsStorage = emptyAdminPeriodsStorage(),
): AcademicPeriod | undefined {
  return getEffectivePeriods(storage).find((period) => period.id === periodId)
}

export function getEffectiveActivePeriod(
  storage: AdminPeriodsStorage = emptyAdminPeriodsStorage(),
): AcademicPeriod | undefined {
  return getEffectivePeriods(storage).find((period) => period.status === 'activo')
}

export function getCareers(
  storage: AdminStudentsStorage = emptyAdminStudentsStorage(),
): string[] {
  return [...new Set(getEffectiveStudents(storage).map((student) => student.career))].sort()
}

export function getCampuses(
  storage: AdminStudentsStorage = emptyAdminStudentsStorage(),
): string[] {
  return [...new Set(getEffectiveStudents(storage).map((student) => student.campus))].sort()
}

export function getDepartments(
  storage: AdminTeachersStorage = emptyAdminTeachersStorage(),
): string[] {
  return [...new Set(getEffectiveTeachers(storage).map((teacher) => teacher.department))].sort()
}

export function getCoursesCountByTeacherId(
  teacherId: ID,
  storage: AdminCoursesStorage = emptyAdminCoursesStorage(),
): number {
  return getEffectiveCourses(storage).filter((course) => course.teacherId === teacherId).length
}

export function getCoursesCountByPeriodId(
  periodId: ID,
  storage: AdminCoursesStorage = emptyAdminCoursesStorage(),
): number {
  return getEffectiveCourses(storage).filter((course) => course.periodId === periodId).length
}

export function getEffectiveAvailableSeats(
  courseId: ID,
  courseStorage: AdminCoursesStorage = emptyAdminCoursesStorage(),
): number {
  const course = getEffectiveCourseById(courseId, courseStorage)
  if (!course) {
    return 0
  }
  const enrolled = getCourseEnrollmentCount(courseId)
  return Math.max(course.capacity - enrolled, 0)
}

export function getCourseStatus(
  courseId: ID,
  storage: AdminCoursesStorage = emptyAdminCoursesStorage(),
): string {
  return getEffectiveCourseById(courseId, storage)?.status ?? 'inactivo'
}

export function getAdminStudentsSummary(
  storage: AdminStudentsStorage = emptyAdminStudentsStorage(),
): AdminStudentsSummary {
  const students = getEffectiveStudents(storage)
  return {
    total: students.length,
    active: students.filter((student) => student.status === 'activo').length,
    inactive: students.filter((student) => student.status === 'inactivo').length,
    graduated: students.filter((student) => student.status === 'graduado').length,
  }
}

export function getAdminTeachersSummary(
  teacherStorage: AdminTeachersStorage = emptyAdminTeachersStorage(),
  courseStorage: AdminCoursesStorage = emptyAdminCoursesStorage(),
): AdminTeachersSummary {
  const teachers = getEffectiveTeachers(teacherStorage)
  const departments = new Set(teachers.map((teacher) => teacher.department))
  const assignedCourses = getEffectiveCourses(courseStorage).filter(
    (course) => course.status === 'activo',
  ).length

  return {
    total: teachers.length,
    active: teachers.filter((teacher) => teacher.status === 'activo').length,
    departments: departments.size,
    assignedCourses,
  }
}

export function getAdminCoursesSummary(
  courseStorage: AdminCoursesStorage = emptyAdminCoursesStorage(),
  periodStorage: AdminPeriodsStorage = emptyAdminPeriodsStorage(),
): AdminCoursesSummary {
  const courses = getEffectiveCourses(courseStorage)
  const activePeriodId =
    getEffectiveActivePeriod(periodStorage)?.id ?? CURRENT_PERIOD_ID
  const currentPeriodCourses = courses.filter((course) => course.periodId === activePeriodId)

  return {
    total: courses.length,
    currentPeriodCount: currentPeriodCourses.length,
    creditsOffered: currentPeriodCourses.reduce((sum, course) => sum + course.credits, 0),
    availableSeats: currentPeriodCourses.reduce(
      (sum, course) => sum + getEffectiveAvailableSeats(course.id, courseStorage),
      0,
    ),
  }
}

export function getAdminPeriodsSummary(
  storage: AdminPeriodsStorage = emptyAdminPeriodsStorage(),
): AdminPeriodsSummary {
  const periods = getEffectivePeriods(storage)
  const activePeriod = periods.find((period) => period.status === 'activo')

  return {
    total: periods.length,
    activePeriod: activePeriod?.name ?? '—',
    closed: periods.filter((period) => period.status === 'cerrado').length,
    planned: periods.filter((period) => period.status === 'planificado').length,
  }
}

function mergeEffectivePayment(
  payment: Payment,
  override: Partial<Payment> | undefined,
): Payment {
  if (!override) {
    return payment
  }
  return { ...payment, ...override }
}

function summarizeFinancePayments(payments: Payment[]): FinanceSummary {
  const totalPaid = payments
    .filter((payment) => payment.status === 'pagado')
    .reduce((sum, payment) => sum + payment.amount, 0)
  const totalPending = payments
    .filter((payment) => payment.status === 'pendiente')
    .reduce((sum, payment) => sum + payment.amount, 0)
  const totalOverdue = payments
    .filter((payment) => payment.status === 'vencido')
    .reduce((sum, payment) => sum + payment.amount, 0)

  return {
    totalBilled: payments.reduce((sum, payment) => sum + payment.amount, 0),
    totalPaid,
    totalPending,
    totalOverdue,
    overdueCount: payments.filter((payment) => payment.status === 'vencido').length,
  }
}

export function getEffectivePayments(
  paymentOverrides: FinancePaymentsStorage = emptyFinancePaymentsStorage(),
): Payment[] {
  return mockPayments.map((payment) =>
    mergeEffectivePayment(payment, paymentOverrides.updated[payment.id]),
  )
}

export function getPaymentById(paymentId: ID): Payment | undefined {
  return mockPayments.find((payment) => payment.id === paymentId)
}

export function getEffectivePaymentById(
  paymentId: ID,
  paymentOverrides: FinancePaymentsStorage = emptyFinancePaymentsStorage(),
): Payment | undefined {
  return getEffectivePayments(paymentOverrides).find((payment) => payment.id === paymentId)
}

export function toFinancePaymentViewModel(payment: Payment): FinancePaymentViewModel {
  const student = getStudentById(payment.studentId)
  return {
    ...payment,
    studentName: student?.fullName ?? '—',
    studentCarnet: student?.carnet ?? '—',
  }
}

export function getFinancePaymentViewModels(
  paymentOverrides: FinancePaymentsStorage = emptyFinancePaymentsStorage(),
): FinancePaymentViewModel[] {
  return getEffectivePayments(paymentOverrides).map(toFinancePaymentViewModel)
}

export function getPaymentsByConcept(
  concept: Payment['concept'],
  paymentOverrides: FinancePaymentsStorage = emptyFinancePaymentsStorage(),
): Payment[] {
  return getEffectivePayments(paymentOverrides).filter((payment) => payment.concept === concept)
}

export function getPaymentsByStatus(
  status: Payment['status'],
  paymentOverrides: FinancePaymentsStorage = emptyFinancePaymentsStorage(),
): Payment[] {
  return getEffectivePayments(paymentOverrides).filter((payment) => payment.status === status)
}

export function getFinanceSummary(
  paymentOverrides: FinancePaymentsStorage = emptyFinancePaymentsStorage(),
): FinanceSummary {
  return summarizeFinancePayments(getEffectivePayments(paymentOverrides))
}

export function getTuitionPaymentsSummary(
  paymentOverrides: FinancePaymentsStorage = emptyFinancePaymentsStorage(),
): FinanceSummary {
  return summarizeFinancePayments(getPaymentsByConcept('matricula', paymentOverrides))
}

export function getCoursePaymentsSummary(
  paymentOverrides: FinancePaymentsStorage = emptyFinancePaymentsStorage(),
): FinanceSummary {
  return summarizeFinancePayments(getPaymentsByConcept('curso', paymentOverrides))
}

export function getPaymentHistorySummary(
  paymentOverrides: FinancePaymentsStorage = emptyFinancePaymentsStorage(),
): PaymentHistorySummary {
  const payments = getEffectivePayments(paymentOverrides)
  const summary = summarizeFinancePayments(payments)
  return {
    transactionCount: payments.length,
    totalPaid: summary.totalPaid,
    totalPending: summary.totalPending,
    totalOverdue: summary.totalOverdue,
  }
}

export function getStudentsWithPayments(
  paymentOverrides: FinancePaymentsStorage = emptyFinancePaymentsStorage(),
): Student[] {
  const studentIds = new Set(
    getEffectivePayments(paymentOverrides).map((payment) => payment.studentId),
  )
  return mockStudents.filter((student) => studentIds.has(student.id))
}

export function getNextDuePayment(
  studentId: ID,
  paymentOverrides: FinancePaymentsStorage = emptyFinancePaymentsStorage(),
): Payment | undefined {
  return getPaymentsByStudentId(studentId, paymentOverrides)
    .filter((payment) => payment.status === 'pendiente' || payment.status === 'vencido')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0]
}

export function getPaymentConceptTotals(
  studentId: ID,
  paymentOverrides: FinancePaymentsStorage = emptyFinancePaymentsStorage(),
): PaymentConceptTotals {
  const payments = getPaymentsByStudentId(studentId, paymentOverrides)
  const sumByConcept = (concept: Payment['concept']) =>
    payments
      .filter((payment) => payment.concept === concept)
      .reduce((sum, payment) => sum + payment.amount, 0)

  return {
    matricula: sumByConcept('matricula'),
    curso: sumByConcept('curso'),
    multa: sumByConcept('multa'),
    otro: sumByConcept('otro'),
  }
}

const PAYMENT_CONCEPTS: Payment['concept'][] = ['matricula', 'curso', 'multa', 'otro']

const PAYMENT_STATUSES: Payment['status'][] = ['pagado', 'pendiente', 'vencido']

const KPI_CATEGORY_ORDER: KpiCategory[] = ['tiempo', 'costo', 'calidad', 'productividad']

function worstRiskLevel(levels: RiskLevel[]): RiskLevel {
  if (levels.includes('rojo')) {
    return 'rojo'
  }
  if (levels.includes('amarillo')) {
    return 'amarillo'
  }
  return 'verde'
}

function impactFromPriority(priority: RiskLevel): 'bajo' | 'medio' | 'alto' {
  if (priority === 'rojo') {
    return 'alto'
  }
  if (priority === 'amarillo') {
    return 'medio'
  }
  return 'bajo'
}

function changeRequestRecommendation(status: ChangeRequest['status']): string {
  if (status === 'abierta') {
    return 'Pendiente de evaluación por comité de control de cambios.'
  }
  if (status === 'en_revision') {
    return 'En análisis de impacto; se recomienda decisión en la próxima reunión.'
  }
  if (status === 'aprobada') {
    return 'Aprobada para incorporación planificada.'
  }
  return 'Rechazada; mantener alcance actual.'
}

function computeDelinquencyRate(
  payments: Payment[],
): number {
  if (payments.length === 0) {
    return 0
  }
  const overdueOrPending = payments.filter(
    (payment) => payment.status === 'vencido' || payment.status === 'pendiente',
  ).length
  return (overdueOrPending / payments.length) * 100
}

function getCoursePerformanceItems(
  gradeOverrides: TeacherGradesStorage = {},
): CoursePerformanceItem[] {
  return getCoursesInCurrentPeriod()
    .map((course) => {
      const enrollments = getEnrollmentsByCourseId(course.id)
      let gradeSum = 0
      let gradeCount = 0
      let approved = 0
      let failed = 0

      for (const enrollment of enrollments) {
        const values = getEffectiveGradeValues(
          enrollment.studentId,
          course.id,
          gradeOverrides,
        )
        const status = computeGradeDisplayStatus(
          values.partial1,
          values.partial2,
          values.finalExam,
          values.finalGrade,
        )

        if (status === 'aprobado') {
          approved += 1
        } else if (status === 'reprobado') {
          failed += 1
        }

        if (values.finalGrade !== null) {
          gradeSum += values.finalGrade
          gradeCount += 1
        }
      }

      const studentCount = enrollments.length
      const evaluated = approved + failed

      return {
        courseId: course.id,
        courseCode: course.code,
        courseName: course.name,
        averageGrade: gradeCount > 0 ? gradeSum / gradeCount : 0,
        passRate: evaluated > 0 ? (approved / evaluated) * 100 : 0,
        atRiskCount: failed,
        studentCount,
      }
    })
    .filter((item) => item.studentCount > 0)
}

export function getStudentsByStatusSummary(): StudentsByStatusSummary {
  return {
    activo: mockStudents.filter((student) => student.status === 'activo').length,
    inactivo: mockStudents.filter((student) => student.status === 'inactivo').length,
    graduado: mockStudents.filter((student) => student.status === 'graduado').length,
  }
}

export function getEnrollmentCountByPeriod(): EnrollmentCountByPeriod[] {
  return mockPeriods.map((period) => {
    const studentIds = new Set(
      mockEnrollments
        .filter(
          (enrollment) =>
            enrollment.periodId === period.id && enrollment.status === 'matriculado',
        )
        .map((enrollment) => enrollment.studentId),
    )

    return {
      periodId: period.id,
      periodName: period.name,
      count: studentIds.size,
    }
  })
}

export function getCourseEnrollmentRanking(limit = 5): CourseEnrollmentRankItem[] {
  return getCoursesInCurrentPeriod()
    .map((course) => ({
      courseId: course.id,
      courseCode: course.code,
      courseName: course.name,
      teacherName: getTeacherNameById(course.teacherId),
      enrollmentCount: getCourseEnrollmentCount(course.id),
    }))
    .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
    .slice(0, limit)
}

export function getCoursesByDepartmentSummary(): CoursesByDepartmentItem[] {
  const counts = new Map<string, number>()

  for (const course of getCoursesInCurrentPeriod()) {
    const teacher = getTeacherById(course.teacherId)
    const department = teacher?.department ?? 'Sin departamento'
    counts.set(department, (counts.get(department) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .map(([department, courseCount]) => ({ department, courseCount }))
    .sort((a, b) => b.courseCount - a.courseCount)
}

export function getAcademicPerformanceSummary(
  gradeOverrides: TeacherGradesStorage = {},
): AcademicPerformanceSummary {
  let approved = 0
  let failed = 0
  let inProgress = 0
  let gradeSum = 0
  let gradeCount = 0

  for (const course of getCoursesInCurrentPeriod()) {
    for (const enrollment of getEnrollmentsByCourseId(course.id)) {
      const values = getEffectiveGradeValues(
        enrollment.studentId,
        course.id,
        gradeOverrides,
      )
      const status = computeGradeDisplayStatus(
        values.partial1,
        values.partial2,
        values.finalExam,
        values.finalGrade,
      )

      if (status === 'aprobado') {
        approved += 1
      } else if (status === 'reprobado') {
        failed += 1
      } else {
        inProgress += 1
      }

      if (values.finalGrade !== null) {
        gradeSum += values.finalGrade
        gradeCount += 1
      }
    }
  }

  const totalEvaluated = approved + failed

  return {
    averageGrade: gradeCount > 0 ? gradeSum / gradeCount : null,
    passRate: totalEvaluated > 0 ? (approved / totalEvaluated) * 100 : 0,
    totalEvaluated,
    approved,
    failed,
    inProgress,
  }
}

export function getCoursesAtAcademicRisk(
  gradeOverrides: TeacherGradesStorage = {},
  limit = 5,
): CoursePerformanceItem[] {
  return getCoursePerformanceItems(gradeOverrides)
    .filter((course) => course.atRiskCount > 0 || course.passRate < 75)
    .sort((a, b) => {
      if (b.atRiskCount !== a.atRiskCount) {
        return b.atRiskCount - a.atRiskCount
      }
      return a.passRate - b.passRate
    })
    .slice(0, limit)
}

export function getTopPerformingCourses(
  gradeOverrides: TeacherGradesStorage = {},
  limit = 5,
): CoursePerformanceItem[] {
  return getCoursePerformanceItems(gradeOverrides)
    .filter((course) => course.averageGrade > 0)
    .sort((a, b) => b.averageGrade - a.averageGrade)
    .slice(0, limit)
}

export function getFinancialBreakdownByConcept(
  paymentOverrides: FinancePaymentsStorage = emptyFinancePaymentsStorage(),
): FinancialBreakdownItem[] {
  return PAYMENT_CONCEPTS.map((concept) => {
    const payments = getPaymentsByConcept(concept, paymentOverrides)
    return {
      concept,
      label: PAYMENT_CONCEPT_LABELS[concept],
      totalBilled: payments.reduce((sum, payment) => sum + payment.amount, 0),
      totalPaid: payments
        .filter((payment) => payment.status === 'pagado')
        .reduce((sum, payment) => sum + payment.amount, 0),
    }
  })
}

export function getPaymentsStatusBreakdown(
  paymentOverrides: FinancePaymentsStorage = emptyFinancePaymentsStorage(),
): PaymentStatusBreakdownItem[] {
  const payments = getEffectivePayments(paymentOverrides)

  return PAYMENT_STATUSES.map((status) => {
    const filtered = payments.filter((payment) => payment.status === status)
    return {
      status,
      label: status === 'pagado' ? 'Pagado' : status === 'pendiente' ? 'Pendiente' : 'Vencido',
      count: filtered.length,
      amount: filtered.reduce((sum, payment) => sum + payment.amount, 0),
    }
  })
}

export function getExecutiveFinancialSummary(
  paymentOverrides: FinancePaymentsStorage = emptyFinancePaymentsStorage(),
): ExecutiveFinancialSummary {
  const payments = getEffectivePayments(paymentOverrides)
  const summary = summarizeFinancePayments(payments)
  const studentIds = new Set(
    payments
      .filter(
        (payment) => payment.status === 'pendiente' || payment.status === 'vencido',
      )
      .map((payment) => payment.studentId),
  )

  return {
    ...summary,
    delinquencyRate: computeDelinquencyRate(payments),
    studentsWithBalance: studentIds.size,
    tuitionIncome: getPaymentsByConcept('matricula', paymentOverrides)
      .filter((payment) => payment.status === 'pagado')
      .reduce((sum, payment) => sum + payment.amount, 0),
  }
}

export function getRevenueTrendByPeriod(
  paymentOverrides: FinancePaymentsStorage = emptyFinancePaymentsStorage(),
): RevenueTrendPoint[] {
  const payments = getEffectivePayments(paymentOverrides).filter(
    (payment) => payment.status === 'pagado',
  )

  return mockPeriods.map((period) => ({
    periodName: period.name,
    amount: payments
      .filter((payment) => payment.periodId === period.id)
      .reduce((sum, payment) => sum + payment.amount, 0),
  }))
}

export function getExecutiveAcademicSummary(
  paymentOverrides: FinancePaymentsStorage = emptyFinancePaymentsStorage(),
  gradeOverrides: TeacherGradesStorage = {},
): ExecutiveAcademicSummary {
  const financial = getExecutiveFinancialSummary(paymentOverrides)
  const performance = getAcademicPerformanceSummary(gradeOverrides)

  return {
    activeStudents: getActiveStudentsCount(),
    coursesOffered: getCoursesInCurrentPeriod().length,
    tuitionIncome: financial.tuitionIncome,
    pendingBalance: financial.totalPending + financial.totalOverdue,
    averageGpa: getAverageGpa(),
    passRate: performance.passRate,
    delinquencyRate: financial.delinquencyRate,
  }
}

export function getProjectExecutiveSummary(): ProjectExecutiveSummary {
  const scheduleMetric = mockProjectMetrics.find((metric) => metric.id === 'kpi-001')
  const scheduleVarianceMetric = mockProjectMetrics.find((metric) => metric.id === 'kpi-009')
  const costVarianceMetric = mockProjectMetrics.find((metric) => metric.id === 'kpi-004')

  return {
    overallProgress: scheduleMetric?.actual ?? 0,
    scheduleVariance: scheduleVarianceMetric?.actual ?? 0,
    costVariance: costVarianceMetric?.actual ?? 0,
    criticalKpis: mockProjectMetrics.filter((metric) => metric.status === 'rojo').length,
    openRisks: getOpenRisks().length,
    openChangeRequests: getOpenChangeRequests().length,
  }
}

export function getProjectMetricsByCategory(): ProjectMetricsByCategory[] {
  return KPI_CATEGORY_ORDER.map((category) => ({
    category,
    label: KPI_CATEGORY_LABELS[category],
    metrics: mockProjectMetrics.filter((metric) => metric.category === category),
  }))
}

export function getProjectMetricsStatusBreakdown(): ProjectMetricsStatusBreakdown {
  return {
    verde: mockProjectMetrics.filter((metric) => metric.status === 'verde').length,
    amarillo: mockProjectMetrics.filter((metric) => metric.status === 'amarillo').length,
    rojo: mockProjectMetrics.filter((metric) => metric.status === 'rojo').length,
  }
}

export function getProjectHealthByCategory(): ProjectHealthItem[] {
  const categories = getProjectMetricsByCategory().map(({ category, label, metrics }) => ({
    category,
    label,
    status: worstRiskLevel(metrics.map((metric) => metric.status)),
  }))

  const riskBreakdown = getRiskLevelBreakdown()
  const riskStatus = worstRiskLevel([
    riskBreakdown.rojo > 0 ? 'rojo' : 'verde',
    riskBreakdown.amarillo > 0 ? 'amarillo' : 'verde',
  ])

  return [
    ...categories,
    {
      category: 'riesgos',
      label: 'Riesgos',
      status: riskStatus,
    },
  ]
}

export function getRiskLevelBreakdown(): RiskLevelBreakdown {
  const openRisks = getOpenRisks()
  return {
    verde: openRisks.filter((risk) => risk.level === 'verde').length,
    amarillo: openRisks.filter((risk) => risk.level === 'amarillo').length,
    rojo: openRisks.filter((risk) => risk.level === 'rojo').length,
  }
}

export function getTopOpenRisks(limit = 6): OpenRiskViewModel[] {
  const levelOrder: Record<RiskLevel, number> = { rojo: 0, amarillo: 1, verde: 2 }

  return getOpenRisks()
    .map((risk) => ({
      ...risk,
      responseStrategy: risk.mitigation,
    }))
    .sort((a, b) => levelOrder[a.level] - levelOrder[b.level])
    .slice(0, limit)
}

export function getChangeRequestSummary(): ChangeRequestSummary {
  return {
    total: mockChangeRequests.length,
    open: mockChangeRequests.filter((request) => request.status === 'abierta').length,
    inReview: mockChangeRequests.filter((request) => request.status === 'en_revision').length,
    approved: mockChangeRequests.filter((request) => request.status === 'aprobada').length,
    rejected: mockChangeRequests.filter((request) => request.status === 'rechazada').length,
  }
}

export function getChangeRequestViewModels(): ChangeRequestViewModel[] {
  return mockChangeRequests.map((request) => ({
    ...request,
    scopeImpact: impactFromPriority(request.priority),
    timeImpact: impactFromPriority(request.priority),
    costImpact: request.priority === 'rojo' ? 'alto' : request.priority === 'amarillo' ? 'medio' : 'bajo',
    recommendation: changeRequestRecommendation(request.status),
  }))
}

export function getOpenChangeRequestViewModels(): ChangeRequestViewModel[] {
  return getChangeRequestViewModels().filter(
    (request) => request.status === 'abierta' || request.status === 'en_revision',
  )
}

export function getProjectProgressTrend(): ProjectProgressTrendPoint[] {
  return mockProjectProgressTrend
}

export function getStudentsByStatusChartData(): ChartSeriesPoint[] {
  const summary = getStudentsByStatusSummary()
  return [
    { name: 'Activos', value: summary.activo },
    { name: 'Inactivos', value: summary.inactivo },
    { name: 'Graduados', value: summary.graduado },
  ]
}

export function getKpiStatusChartData(): ChartSeriesPoint[] {
  const breakdown = getProjectMetricsStatusBreakdown()
  return [
    { name: 'En meta', value: breakdown.verde },
    { name: 'Atención', value: breakdown.amarillo },
    { name: 'Crítico', value: breakdown.rojo },
  ]
}

export function getRiskLevelChartData(): ChartSeriesPoint[] {
  const breakdown = getRiskLevelBreakdown()
  return [
    { name: 'Bajo', value: breakdown.verde },
    { name: 'Medio', value: breakdown.amarillo },
    { name: 'Alto', value: breakdown.rojo },
  ]
}

export function getProjectKpiComparisonByCategory(): ProjectKpiComparisonItem[] {
  return KPI_CATEGORY_ORDER.map((category) => {
    const metrics = mockProjectMetrics.filter((metric) => metric.category === category)
    const primary = metrics[0]
    if (!primary) {
      return null
    }
    return {
      name: primary.name,
      planned: primary.planned,
      actual: primary.actual,
      unit: primary.unit,
    }
  }).filter((item): item is ProjectKpiComparisonItem => item !== null)
}

export function getProjectKpiComparisonChartData(): KpiComparisonChartPoint[] {
  return getProjectKpiComparisonByCategory().map((item) => ({
    name: item.name.length > 22 ? `${item.name.slice(0, 22)}…` : item.name,
    planificado: item.planned,
    real: item.actual,
    unit: item.unit,
  }))
}

export function getProjectKpiComparison(limit = 6): ProjectKpiComparisonItem[] {
  return mockProjectMetrics.slice(0, limit).map((metric) => ({
    name: metric.name,
    planned: metric.planned,
    actual: metric.actual,
    unit: metric.unit,
  }))
}

export function calculateMetricVariation(metric: ProjectMetric): number | null {
  if (metric.planned === 0) {
    return null
  }
  return ((metric.actual - metric.planned) / metric.planned) * 100
}
