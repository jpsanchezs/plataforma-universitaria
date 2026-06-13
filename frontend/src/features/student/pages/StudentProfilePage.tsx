import {
  getCurrentAcademicPeriod,
  getStudentAcademicSummary,
  getStudentEnrollmentSummary,
  getStudentFinancialSummary,
} from '@/data/selectors'
import { useCurrentStudent } from '@/features/student/hooks/useCurrentStudent'
import { useStudentEnrollments } from '@/features/student/hooks/useStudentEnrollments'
import { useFinancePaymentStorage } from '@/features/finance/hooks/useFinancePaymentStorage'
import { StudentSummaryCard } from '@/features/student/components/StudentSummaryCard'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageShell } from '@/components/layout/PageShell'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { FiBookOpen, FiCreditCard, FiMail, FiPhone, FiTrendingUp } from 'react-icons/fi'
import { formatCurrencyCRC, formatGpa, formatGrade, formatNumber } from '@/utils/formatters'

export function StudentProfilePage() {
  const { student } = useCurrentStudent()
  const { summary, overrides } = useStudentEnrollments(student?.id)
  const [paymentStorage] = useFinancePaymentStorage()

  if (!student) {
    return (
      <PageShell>
        <EmptyState
          title="Perfil no disponible"
          description="No se encontró un expediente estudiantil vinculado a su usuario demo."
        />
      </PageShell>
    )
  }

  const period = getCurrentAcademicPeriod()
  const enrollmentSummary = summary ?? getStudentEnrollmentSummary(student.id, overrides)
  const academicSummary = getStudentAcademicSummary(student.id, overrides)
  const financialSummary = getStudentFinancialSummary(student.id, paymentStorage)

  return (
    <PageShell>
      <PageHeader
        title="Mi perfil"
        description="Información personal, académica y de contacto institucional."
      />

      <div className="space-y-6">
        <StudentSummaryCard student={student} />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Cursos matriculados"
            value={formatNumber(enrollmentSummary.courseCount)}
            hint={period?.name}
            icon={<FiBookOpen size={18} />}
          />
          <StatCard
            label="Créditos matriculados"
            value={formatNumber(enrollmentSummary.totalCredits)}
            hint="Período actual"
            icon={<FiBookOpen size={18} />}
          />
          <StatCard
            label="Promedio del período"
            value={
              academicSummary.averageGrade !== null
                ? formatGrade(academicSummary.averageGrade)
                : formatGpa(student.gpa)
            }
            hint="GPA acumulado disponible"
            icon={<FiTrendingUp size={18} />}
          />
          <StatCard
            label="Saldo pendiente"
            value={formatCurrencyCRC(financialSummary.balance)}
            hint="Estado financiero simulado"
            icon={<FiCreditCard size={18} />}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card
            title="Información académica"
            description={`Período actual: ${period?.name ?? '—'}. Estado: ${period?.status ?? '—'}.`}
            icon={<FiBookOpen size={20} />}
            footer={
              <p className="text-sm text-muted">
                Cursos en curso: {formatNumber(academicSummary.inProgressCourses)} · Aprobados
                registrados: {formatNumber(academicSummary.approvedCourses)}
              </p>
            }
          />
          <Card
            title="Información de contacto"
            description={`${student.email} · ${student.phone}`}
            icon={<FiMail size={20} />}
            footer={<p className="text-sm text-muted">{student.campus}</p>}
          />
          <Card
            title="Resumen financiero"
            description={`Pagado: ${formatCurrencyCRC(financialSummary.totalPaid)}`}
            icon={<FiPhone size={20} />}
            footer={
              <p className="text-sm text-muted">
                Pendiente: {formatCurrencyCRC(financialSummary.totalPending)} · Vencido:{' '}
                {formatCurrencyCRC(financialSummary.overdueAmount)}
              </p>
            }
          />
        </div>
      </div>
    </PageShell>
  )
}
