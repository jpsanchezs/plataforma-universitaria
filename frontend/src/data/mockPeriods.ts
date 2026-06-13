import type { AcademicPeriod } from '@/types/academic'

export const mockPeriods: AcademicPeriod[] = [
  {
    id: 'per-2025-ii',
    name: '2025-II',
    startDate: '2025-08-01',
    endDate: '2025-12-15',
    status: 'cerrado',
  },
  {
    id: 'per-2026-i',
    name: '2026-I',
    startDate: '2026-02-01',
    endDate: '2026-06-30',
    status: 'activo',
  },
  {
    id: 'per-2026-ii',
    name: '2026-II',
    startDate: '2026-08-01',
    endDate: '2026-12-15',
    status: 'planificado',
  },
]

export const CURRENT_PERIOD_ID = 'per-2026-i'
