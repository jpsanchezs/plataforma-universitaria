import type { InputHTMLAttributes } from 'react'
import { FiSearch } from 'react-icons/fi'
import { cn } from '@/utils/cn'

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearch?: (value: string) => void
}

export function SearchInput({ className, onSearch, onChange, ...props }: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <FiSearch
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        size={16}
        aria-hidden
      />
      <input
        type="search"
        aria-label={props['aria-label'] ?? 'Buscar'}
        className="w-full rounded-lg border border-primary/20 bg-card py-2 pl-9 pr-3 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        onChange={(event) => {
          onChange?.(event)
          onSearch?.(event.target.value)
        }}
        {...props}
      />
    </div>
  )
}
