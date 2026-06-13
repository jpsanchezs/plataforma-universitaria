import type { ReactNode } from 'react'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import { FilterBar } from '@/components/ui/FilterBar'
import { PAYMENT_CONCEPT_FILTER_OPTIONS, PAYMENT_STATUS_FILTER_OPTIONS } from '@/features/finance/constants'
import type { PaymentConceptFilter, PaymentStatusFilter } from '@/features/finance/types'

interface PaymentFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder: string
  statusFilter: PaymentStatusFilter
  onStatusFilterChange: (value: PaymentStatusFilter) => void
  conceptFilter?: PaymentConceptFilter
  onConceptFilterChange?: (value: PaymentConceptFilter) => void
  studentFilter?: string
  onStudentFilterChange?: (value: string) => void
  studentOptions?: { value: string; label: string }[]
  dateFrom?: string
  dateTo?: string
  onDateFromChange?: (value: string) => void
  onDateToChange?: (value: string) => void
  actions?: ReactNode
}

export function PaymentFilters({
  search,
  onSearchChange,
  searchPlaceholder,
  statusFilter,
  onStatusFilterChange,
  conceptFilter,
  onConceptFilterChange,
  studentFilter,
  onStudentFilterChange,
  studentOptions,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  actions,
}: PaymentFiltersProps) {
  return (
    <FilterBar className="mb-6">
      <SearchInput
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={searchPlaceholder}
        className="min-w-56 flex-1"
        aria-label={searchPlaceholder}
      />
      <Select
        label="Estado"
        value={statusFilter}
        onChange={(event) => onStatusFilterChange(event.target.value as PaymentStatusFilter)}
        options={[...PAYMENT_STATUS_FILTER_OPTIONS]}
        className="min-w-36"
      />
      {conceptFilter !== undefined && onConceptFilterChange ? (
        <Select
          label="Concepto"
          value={conceptFilter}
          onChange={(event) => onConceptFilterChange(event.target.value as PaymentConceptFilter)}
          options={[...PAYMENT_CONCEPT_FILTER_OPTIONS]}
          className="min-w-36"
        />
      ) : null}
      {studentFilter !== undefined && onStudentFilterChange && studentOptions ? (
        <Select
          label="Estudiante"
          value={studentFilter}
          onChange={(event) => onStudentFilterChange(event.target.value)}
          options={studentOptions}
          className="min-w-48"
        />
      ) : null}
      {dateFrom !== undefined && onDateFromChange ? (
        <div className="min-w-40">
          <label htmlFor="payment-date-from" className="mb-1.5 block text-sm font-medium text-text">
            Desde
          </label>
          <input
            id="payment-date-from"
            type="date"
            value={dateFrom}
            onChange={(event) => onDateFromChange(event.target.value)}
            className="w-full rounded-lg border border-primary/20 bg-card px-3 py-2 text-sm"
          />
        </div>
      ) : null}
      {dateTo !== undefined && onDateToChange ? (
        <div className="min-w-40">
          <label htmlFor="payment-date-to" className="mb-1.5 block text-sm font-medium text-text">
            Hasta
          </label>
          <input
            id="payment-date-to"
            type="date"
            value={dateTo}
            onChange={(event) => onDateToChange(event.target.value)}
            className="w-full rounded-lg border border-primary/20 bg-card px-3 py-2 text-sm"
          />
        </div>
      ) : null}
      {actions}
    </FilterBar>
  )
}
