import { formatCurrencyCRC, formatNumber } from '@/utils/formatters'

export function financeSummaryToCards(summary: {
  totalBilled: number
  totalPaid: number
  totalPending: number
  totalOverdue: number
  overdueCount?: number
}) {
  return [
    { label: 'Total facturado', value: formatCurrencyCRC(summary.totalBilled) },
    { label: 'Total pagado', value: formatCurrencyCRC(summary.totalPaid) },
    { label: 'Total pendiente', value: formatCurrencyCRC(summary.totalPending) },
    {
      label: 'Vencido',
      value:
        summary.overdueCount !== undefined
          ? `${formatCurrencyCRC(summary.totalOverdue)} (${formatNumber(summary.overdueCount)})`
          : formatCurrencyCRC(summary.totalOverdue),
    },
  ]
}

export function historySummaryToCards(summary: {
  transactionCount: number
  totalPaid: number
  totalPending: number
  totalOverdue: number
}) {
  return [
    { label: 'Total transacciones', value: formatNumber(summary.transactionCount) },
    { label: 'Monto pagado', value: formatCurrencyCRC(summary.totalPaid) },
    { label: 'Monto pendiente', value: formatCurrencyCRC(summary.totalPending) },
    { label: 'Monto vencido', value: formatCurrencyCRC(summary.totalOverdue) },
  ]
}
