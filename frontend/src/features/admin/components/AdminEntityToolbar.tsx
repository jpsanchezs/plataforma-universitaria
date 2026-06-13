import type { ReactNode } from 'react'
import { FiPlus } from 'react-icons/fi'
import { ActionButton } from '@/components/ui/ActionButton'
import { SearchInput } from '@/components/ui/SearchInput'

interface AdminEntityToolbarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder: string
  filters?: ReactNode
  onCreate: () => void
  createLabel: string
}

export function AdminEntityToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters,
  onCreate,
  createLabel,
}: AdminEntityToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <SearchInput
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="min-w-56 flex-1"
          aria-label={searchPlaceholder}
        />
        {filters}
      </div>
      <ActionButton icon={<FiPlus size={16} />} onClick={onCreate}>
        {createLabel}
      </ActionButton>
    </div>
  )
}
