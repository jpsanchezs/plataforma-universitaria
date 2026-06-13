import { useState, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

export interface TabItem {
  id: string
  label: string
  content: ReactNode
}

interface TabsProps {
  items: TabItem[]
  defaultTabId?: string
  className?: string
}

export function Tabs({ items, defaultTabId, className }: TabsProps) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId ?? items[0]?.id ?? '')

  const activeTab = items.find((item) => item.id === activeTabId) ?? items[0]

  if (!activeTab) {
    return null
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Pestañas"
        className="flex flex-wrap gap-2 border-b border-primary/10 pb-2"
      >
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={activeTabId === item.id}
            onClick={() => setActiveTabId(item.id)}
            className={cn(
              'rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
              activeTabId === item.id
                ? 'bg-primary text-white'
                : 'text-muted hover:bg-primary/10 hover:text-primary',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="pt-4">
        {activeTab.content}
      </div>
    </div>
  )
}
