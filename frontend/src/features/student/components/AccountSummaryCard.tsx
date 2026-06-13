import type { StudentFinancialSummary } from '@/data/selectors'
import { StatCard } from '@/components/ui/StatCard'
import { FiCalendar, FiCreditCard, FiDollarSign } from 'react-icons/fi'
import { formatCurrencyCRC, formatDate } from '@/utils/formatters'

interface AccountSummaryCardProps {
  summary: StudentFinancialSummary
}

export function AccountSummaryCard({ summary }: AccountSummaryCardProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Saldo pendiente"
        value={formatCurrencyCRC(summary.balance)}
        hint="Pendiente + vencido"
        icon={<FiCreditCard size={18} />}
      />
      <StatCard
        label="Total pagado"
        value={formatCurrencyCRC(summary.totalPaid)}
        hint="Pagos confirmados"
        icon={<FiDollarSign size={18} />}
      />
      <StatCard
        label="Total vencido"
        value={formatCurrencyCRC(summary.overdueAmount)}
        hint="Requiere gestión"
        icon={<FiCreditCard size={18} />}
      />
      <StatCard
        label="Próximo vencimiento"
        value={summary.nextDueDate ? formatDate(summary.nextDueDate) : 'Sin vencimientos'}
        hint="Fecha límite más próxima"
        icon={<FiCalendar size={18} />}
      />
    </div>
  )
}
