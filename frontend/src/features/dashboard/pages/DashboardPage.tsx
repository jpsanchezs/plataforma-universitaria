import { useMemo } from 'react'
import {
  FiBookOpen,
  FiClock,
  FiCreditCard,
  FiDollarSign,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi'
import type { ReactNode } from 'react'
import {
  getActiveStudentsCount,
  getCoursesByTeacherId,
  getCoursesInCurrentPeriod,
  getCurrentAcademicPeriod,
  getExecutiveAcademicSummary,
  getExecutiveFinancialSummary,
  getNextScheduleBlock,
  getOpenRisks,
  getPendingAttendanceCountByTeacherId,
  getPendingGradesCountByTeacherId,
  getProjectExecutiveSummary,
  getProjectKpis,
  getStudentAcademicSummary,
  getStudentByUserId,
  getStudentFinancialSummary,
  getStudentsCountByTeacherId,
  getTeacherByUserId,
  getTeachersCount,
} from '@/data/selectors'
import { CURRENT_PERIOD_ID } from '@/data/mockPeriods'
import { useAuth } from '@/features/auth/useAuth'
import { useFinancePaymentStorage } from '@/features/finance/hooks/useFinancePaymentStorage'
import { useStudentEnrollments } from '@/features/student/hooks/useStudentEnrollments'
import { TEACHER_GRADES_STORAGE_KEY } from '@/features/teacher/constants'
import type { TeacherGradesStorage } from '@/features/teacher/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { PageHeader } from '@/components/ui/PageHeader'
import { QuickActionCard } from '@/components/ui/QuickActionCard'
import { StatCard } from '@/components/ui/StatCard'
import { PageShell } from '@/components/layout/PageShell'
import { Badge } from '@/components/ui/Badge'
import { Alert } from '@/components/feedback/Alert'
import { ROLE_LABELS } from '@/utils/permissions'
import { ROUTES } from '@/utils/routes'
import { getStatusLabel } from '@/utils/status'
import {
  formatCurrencyCRC,
  formatGpa,
  formatGrade,
  formatNumber,
  formatPercentage,
} from '@/utils/formatters'

interface DashboardStat {
  label: string
  value: string
  hint?: string
  icon: ReactNode
}

interface DashboardAction {
  title: string
  description: string
  to: string
  actionLabel: string
}

export function DashboardPage() {
  const { user } = useAuth()
  const [paymentStorage] = useFinancePaymentStorage()
  const [gradeOverrides] = useLocalStorage<TeacherGradesStorage>(
    TEACHER_GRADES_STORAGE_KEY,
    {},
  )

  const student = user ? getStudentByUserId(user.id) : undefined
  const { summary: enrollmentSummary, overrides } = useStudentEnrollments(student?.id)

  const content = useMemo(() => {
    if (!user) {
      return { stats: [] as DashboardStat[], actions: [] as DashboardAction[] }
    }

    switch (user.role) {
      case 'estudiante': {
        if (!student) {
          return {
            stats: [
              {
                label: 'Perfil estudiantil',
                value: 'No vinculado',
                hint: 'Usuario demo sin expediente asociado',
                icon: <FiBookOpen size={18} />,
              },
            ],
            actions: [],
          }
        }

        const financial = getStudentFinancialSummary(student.id, paymentStorage)
        const academic = getStudentAcademicSummary(
          student.id,
          overrides,
          CURRENT_PERIOD_ID,
          gradeOverrides,
        )
        const nextSchedule = getNextScheduleBlock(student.id, overrides)
        const average =
          academic.averageGrade !== null ? formatGrade(academic.averageGrade) : formatGpa(student.gpa)

        return {
          stats: [
            {
              label: 'Cursos matriculados',
              value: formatNumber(enrollmentSummary?.courseCount ?? 0),
              hint: enrollmentSummary?.period?.name ?? 'Período activo',
              icon: <FiBookOpen size={18} />,
            },
            {
              label: 'Saldo pendiente',
              value: formatCurrencyCRC(financial.balance),
              hint: 'Incluye cambios del portal financiero',
              icon: <FiCreditCard size={18} />,
            },
            {
              label: academic.averageGrade !== null ? 'Promedio del período' : 'Promedio acumulado (GPA)',
              value: average,
              hint: 'Considera notas efectivas del docente',
              icon: <FiTrendingUp size={18} />,
            },
            ...(nextSchedule
              ? [
                  {
                    label: 'Próximo horario',
                    value: `${nextSchedule.day} ${nextSchedule.startTime}`,
                    hint: `${nextSchedule.courseName} — ${nextSchedule.room}`,
                    icon: <FiClock size={18} />,
                  },
                ]
              : []),
          ],
          actions: [
            {
              title: 'Consultar horarios',
              description: 'Revise su agenda semanal de clases.',
              to: ROUTES.STUDENT.SCHEDULE,
              actionLabel: 'Ver horarios',
            },
            {
              title: 'Ver calificaciones',
              description: 'Consulte el avance académico del período.',
              to: ROUTES.STUDENT.GRADES,
              actionLabel: 'Ver calificaciones',
            },
          ],
        }
      }

      case 'docente': {
        const teacher = getTeacherByUserId(user.id)
        if (!teacher) {
          return {
            stats: [
              {
                label: 'Perfil docente',
                value: 'No vinculado',
                hint: 'Usuario demo sin expediente asociado',
                icon: <FiUsers size={18} />,
              },
            ],
            actions: [],
          }
        }

        const courses = getCoursesByTeacherId(teacher.id)
        return {
          stats: [
            {
              label: 'Cursos asignados',
              value: formatNumber(courses.length),
              hint: getCurrentAcademicPeriod()?.name ?? 'Período activo',
              icon: <FiBookOpen size={18} />,
            },
            {
              label: 'Estudiantes asociados',
              value: formatNumber(getStudentsCountByTeacherId(teacher.id)),
              hint: 'Matriculados en sus cursos',
              icon: <FiUsers size={18} />,
            },
            {
              label: 'Asistencia pendiente',
              value: formatNumber(getPendingAttendanceCountByTeacherId(teacher.id)),
              hint: 'Registros base sin cerrar',
              icon: <FiClock size={18} />,
            },
            {
              label: 'Calificaciones por registrar',
              value: formatNumber(getPendingGradesCountByTeacherId(teacher.id)),
              hint: 'Evaluaciones incompletas en mocks',
              icon: <FiTrendingUp size={18} />,
            },
          ],
          actions: [
            {
              title: 'Registrar asistencia',
              description: 'Marque presentes y ausentes por sesión.',
              to: ROUTES.TEACHER.ATTENDANCE,
              actionLabel: 'Ir a asistencia',
            },
            {
              title: 'Cargar calificaciones',
              description: 'Actualice notas parciales y finales.',
              to: ROUTES.TEACHER.GRADES,
              actionLabel: 'Ir a calificaciones',
            },
          ],
        }
      }

      case 'administrativo': {
        const period = getCurrentAcademicPeriod()
        return {
          stats: [
            {
              label: 'Estudiantes activos',
              value: formatNumber(getActiveStudentsCount()),
              hint: 'Expedientes operativos (mocks base)',
              icon: <FiUsers size={18} />,
            },
            {
              label: 'Cursos registrados',
              value: formatNumber(getCoursesInCurrentPeriod().length),
              hint: period?.name ?? 'Período actual',
              icon: <FiBookOpen size={18} />,
            },
            {
              label: 'Período académico',
              value: period?.name ?? '—',
              hint: period ? `Estado: ${getStatusLabel(period.status)}` : 'Sin período activo',
              icon: <FiClock size={18} />,
            },
            {
              label: 'Docentes registrados',
              value: formatNumber(getTeachersCount()),
              hint: 'Plantilla docente activa',
              icon: <FiUsers size={18} />,
            },
          ],
          actions: [
            {
              title: 'Gestionar estudiantes',
              description: 'Altas, bajas y actualización de expedientes.',
              to: ROUTES.ADMIN.STUDENTS,
              actionLabel: 'Ir a estudiantes',
            },
            {
              title: 'Administrar cursos',
              description: 'Capacidad, docentes y horarios.',
              to: ROUTES.ADMIN.COURSES,
              actionLabel: 'Ir a cursos',
            },
          ],
        }
      }

      case 'financiero': {
        const financial = getExecutiveFinancialSummary(paymentStorage)
        return {
          stats: [
            {
              label: 'Total pagos pendientes',
              value: formatCurrencyCRC(financial.totalPending),
              hint: 'Montos por conciliar',
              icon: <FiCreditCard size={18} />,
            },
            {
              label: 'Ingresos por matrícula',
              value: formatCurrencyCRC(financial.tuitionIncome),
              hint: getCurrentAcademicPeriod()?.name ?? 'Período activo',
              icon: <FiDollarSign size={18} />,
            },
            {
              label: 'Pagos vencidos',
              value: formatCurrencyCRC(financial.totalOverdue),
              hint: `${formatNumber(financial.studentsWithBalance)} estudiantes con saldo`,
              icon: <FiTrendingUp size={18} />,
            },
            {
              label: 'Morosidad',
              value: formatPercentage(financial.delinquencyRate, 1),
              hint: 'Sobre cartera efectiva simulada',
              icon: <FiUsers size={18} />,
            },
          ],
          actions: [
            {
              title: 'Procesar matrícula',
              description: 'Gestione pagos de matrícula del período.',
              to: ROUTES.FINANCE.TUITION,
              actionLabel: 'Ir a matrícula',
            },
            {
              title: 'Revisar historial',
              description: 'Audite transacciones recientes.',
              to: ROUTES.FINANCE.HISTORY,
              actionLabel: 'Ver historial',
            },
          ],
        }
      }

      case 'ejecutivo': {
        const summary = getExecutiveAcademicSummary(paymentStorage, gradeOverrides)
        return {
          stats: [
            {
              label: 'Estudiantes activos',
              value: formatNumber(summary.activeStudents),
              hint: 'Población estudiantil operativa',
              icon: <FiUsers size={18} />,
            },
            {
              label: 'Ingresos por matrícula',
              value: formatCurrencyCRC(summary.tuitionIncome),
              hint: 'Pagos efectivos del portal financiero',
              icon: <FiDollarSign size={18} />,
            },
            {
              label: 'Promedio académico',
              value: formatGpa(summary.averageGpa),
              hint: 'GPA institucional simulado',
              icon: <FiTrendingUp size={18} />,
            },
            {
              label: 'Morosidad',
              value: formatPercentage(summary.delinquencyRate, 1),
              hint: 'Saldo pendiente incluido en resumen',
              icon: <FiCreditCard size={18} />,
            },
          ],
          actions: [
            {
              title: 'Ver indicadores académicos',
              description: 'Profundice en matrícula, rendimiento e ingresos.',
              to: ROUTES.EXECUTIVE.ACADEMIC,
              actionLabel: 'Dashboard académico',
            },
            {
              title: 'Analizar ingresos',
              description: 'Compare matrícula vs. cartera pendiente.',
              to: ROUTES.EXECUTIVE.ACADEMIC,
              actionLabel: 'Ver finanzas',
            },
          ],
        }
      }

      case 'director-proyecto': {
        const projectSummary = getProjectExecutiveSummary()
        const projectKpis = getProjectKpis()
        const openRisks = getOpenRisks()

        return {
          stats: [
            {
              label: 'Avance general',
              value: formatPercentage(projectSummary.overallProgress, 0),
              hint: 'Cronograma del proyecto',
              icon: <FiTrendingUp size={18} />,
            },
            {
              label: 'KPIs críticos',
              value: formatNumber(projectSummary.criticalKpis),
              hint: projectKpis[1]?.label ?? 'Indicadores en rojo',
              icon: <FiClock size={18} />,
            },
            {
              label: 'Riesgos abiertos',
              value: formatNumber(projectSummary.openRisks),
              hint: 'Registro de riesgos activos',
              icon: <FiUsers size={18} />,
            },
            {
              label: 'Cambios abiertos',
              value: formatNumber(projectSummary.openChangeRequests),
              hint: 'Solicitudes abiertas o en revisión',
              icon: <FiBookOpen size={18} />,
            },
          ],
          actions: [
            {
              title: 'Revisar riesgos',
              description: `${formatNumber(openRisks.length)} riesgos abiertos en el registro.`,
              to: ROUTES.EXECUTIVE.PROJECT,
              actionLabel: 'Ver riesgos',
            },
            {
              title: 'Monitorear KPIs',
              description: 'Tiempo, costo, calidad y productividad.',
              to: ROUTES.EXECUTIVE.PROJECT,
              actionLabel: 'Dashboard del proyecto',
            },
          ],
        }
      }

      default:
        return { stats: [], actions: [] }
    }
  }, [user, student, enrollmentSummary, overrides, paymentStorage, gradeOverrides])

  if (!user) {
    return null
  }

  const roleLabel = ROLE_LABELS[user.role]

  return (
    <PageShell>
      <PageHeader
        title={`Bienvenido, ${user.fullName.split(' ')[0]}`}
        description={`Resumen operativo para rol ${roleLabel}. Los indicadores financieros y académicos reflejan cambios demo guardados en este navegador.`}
        actions={<Badge variant="default">Dashboard principal</Badge>}
      />

      <Alert variant="info" className="mb-6">
        Prototipo UTLM: use &quot;Datos demo&quot; en el encabezado para restablecer matrícula, notas,
        pagos y cambios administrativos antes de una presentación.
      </Alert>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {content.stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            hint={stat.hint}
            icon={stat.icon}
          />
        ))}
      </div>

      {content.actions.length > 0 ? (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-primary">Accesos rápidos</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {content.actions.map((action) => (
              <QuickActionCard
                key={action.title}
                title={action.title}
                description={action.description}
                to={action.to}
                actionLabel={action.actionLabel}
              />
            ))}
          </div>
        </section>
      ) : null}
    </PageShell>
  )
}
