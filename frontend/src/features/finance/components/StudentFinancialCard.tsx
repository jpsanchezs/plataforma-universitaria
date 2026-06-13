import type { Student } from '@/types/academic'
import type { AccountSummary } from '@/types/finance'
import type { ISODateString } from '@/types/common'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatCurrencyCRC, formatShortDate } from '@/utils/formatters'

interface StudentFinancialCardProps {
  student: Student
  summary: AccountSummary
  nextDueDate: ISODateString | null
}

export function StudentFinancialCard({
  student,
  summary,
  nextDueDate,
}: StudentFinancialCardProps) {
  return (
    <div className="mb-6 grid gap-4 lg:grid-cols-2">
      <article className="rounded-xl border border-primary/10 bg-card p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Perfil financiero</p>
        <h3 className="mt-1 text-lg font-semibold text-text">{student.fullName}</h3>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-muted">Carnet</dt>
            <dd className="text-text">{student.carnet}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted">Carrera</dt>
            <dd className="text-text">{student.career}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted">Estado académico</dt>
            <dd>
              <StatusBadge status={student.status} />
            </dd>
          </div>
        </dl>
      </article>

      <article className="rounded-xl border border-primary/10 bg-card p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Resumen de cuenta</p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-muted">Saldo pendiente</dt>
            <dd className="font-semibold text-text">{formatCurrencyCRC(summary.balance)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted">Total pagado</dt>
            <dd className="text-text">{formatCurrencyCRC(summary.totalPaid)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted">Total vencido</dt>
            <dd className="text-text">{formatCurrencyCRC(summary.overdueAmount)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted">Próximo vencimiento</dt>
            <dd className="text-text">
              {nextDueDate ? formatShortDate(nextDueDate) : '—'}
            </dd>
          </div>
        </dl>
      </article>
    </div>
  )
}
