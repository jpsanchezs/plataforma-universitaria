import type { FinancialBreakdownItem } from '@/features/executive/types'
import { EXECUTIVE_CHART_COLORS } from '@/features/executive/constants'
import { ExecutiveChartCard } from '@/features/executive/components/ExecutiveChartCard'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrencyCRC } from '@/utils/formatters'

interface FinancialBreakdownChartProps {
  data: FinancialBreakdownItem[]
  title?: string
  description?: string
}

export function FinancialBreakdownChart({
  data,
  title = 'Ingresos por concepto',
  description = 'Distribución de montos pagados por tipo de cargo.',
}: FinancialBreakdownChartProps) {
  const chartData = data
    .filter((item) => item.totalPaid > 0)
    .map((item) => ({
      name: item.label,
      value: item.totalPaid,
    }))

  return (
    <ExecutiveChartCard title={title} description={description}>
      {chartData.length === 0 ? (
        <p className="flex h-full items-center justify-center text-sm text-muted">
          Sin ingresos registrados.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={EXECUTIVE_CHART_COLORS.pie[index % EXECUTIVE_CHART_COLORS.pie.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrencyCRC(Number(value))} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ExecutiveChartCard>
  )
}
