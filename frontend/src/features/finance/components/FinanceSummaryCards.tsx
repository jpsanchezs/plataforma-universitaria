import type { ReactNode } from 'react'
import { StatCard } from '@/components/ui/StatCard'

interface SummaryCardItem {
  label: string
  value: string
  icon?: ReactNode
}

interface FinanceSummaryCardsProps {
  items: SummaryCardItem[]
}

export function FinanceSummaryCards({ items }: FinanceSummaryCardsProps) {
  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <StatCard key={item.label} label={item.label} value={item.value} icon={item.icon} />
      ))}
    </div>
  )
}
