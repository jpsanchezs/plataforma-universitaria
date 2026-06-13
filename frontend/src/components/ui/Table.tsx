import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export interface TableColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  className?: string
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  emptyMessage?: string
  className?: string
}

export function Table<T extends { id: string }>({
  columns,
  data,
  emptyMessage = 'No hay registros para mostrar.',
  className,
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-primary/10 bg-card px-4 py-8 text-center text-sm text-muted">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={cn('overflow-x-auto rounded-xl border border-primary/10 bg-card', className)}>
      <table className="min-w-full divide-y divide-primary/10 text-sm">
        <thead className="bg-primary/5">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted',
                  column.className,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-primary/10">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-primary/5">
              {columns.map((column) => (
                <td key={column.key} className={cn('px-4 py-3 text-text', column.className)}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
