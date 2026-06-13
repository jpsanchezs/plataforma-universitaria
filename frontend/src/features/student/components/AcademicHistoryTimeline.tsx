import type { AcademicHistoryItem } from '@/types/academic'
import { getPeriodById } from '@/data/selectors'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatGrade, formatNumber } from '@/utils/formatters'

interface AcademicHistoryTimelineProps {
  items: AcademicHistoryItem[]
}

export function AcademicHistoryTimeline({ items }: AcademicHistoryTimelineProps) {
  const grouped = items.reduce<Record<string, AcademicHistoryItem[]>>((acc, item) => {
    const periodName = getPeriodById(item.periodId)?.name ?? item.periodId
    acc[periodName] = acc[periodName] ? [...acc[periodName], item] : [item]
    return acc
  }, {})

  const periods = Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a))

  if (periods.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {periods.map(([periodName, periodItems]) => (
        <section key={periodName} className="rounded-xl border border-primary/10 bg-card p-5">
          <h3 className="mb-4 text-lg font-semibold text-primary">Período {periodName}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-primary/10 text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-3 py-2">Código</th>
                  <th className="px-3 py-2">Curso</th>
                  <th className="px-3 py-2">Créditos</th>
                  <th className="px-3 py-2">Nota final</th>
                  <th className="px-3 py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {periodItems.map((item) => (
                  <tr key={item.id} className="border-b border-primary/5">
                    <td className="px-3 py-3 font-medium text-text">{item.courseCode}</td>
                    <td className="px-3 py-3 text-text">{item.courseName}</td>
                    <td className="px-3 py-3 text-text">{formatNumber(item.credits)}</td>
                    <td className="px-3 py-3 text-text">{formatGrade(item.finalGrade)}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  )
}
