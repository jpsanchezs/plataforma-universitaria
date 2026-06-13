import type { ISODateString } from '@/types/common'

const crcFormatter = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('es-CR')

const dateFormatter = new Intl.DateTimeFormat('es-CR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const shortDateFormatter = new Intl.DateTimeFormat('es-CR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

export function formatCurrencyCRC(value: number): string {
  return crcFormatter.format(value)
}

export function formatDate(date: ISODateString | Date): string {
  const parsed = typeof date === 'string' ? new Date(`${date}T00:00:00`) : date
  return dateFormatter.format(parsed)
}

export function formatShortDate(date: ISODateString | Date): string {
  const parsed = typeof date === 'string' ? new Date(`${date}T00:00:00`) : date
  return shortDateFormatter.format(parsed)
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

export function formatGrade(value: number): string {
  return value.toFixed(1)
}

export function formatGradeCell(value: number | null): string {
  return value === null ? 'Pendiente' : value.toFixed(1)
}

export function formatGpa(value: number): string {
  return value.toFixed(2)
}
