import type { ID } from '@/types/common'

export interface StudentEnrollmentOverrides {
  addedCourseIds: ID[]
  removedCourseIds: ID[]
}

export type StudentEnrollmentsStorage = Record<ID, StudentEnrollmentOverrides>

export type EnrollmentFilter = 'todos' | 'disponibles' | 'matriculados' | 'sin_cupo'

export type PaymentFilter = 'todos' | 'pagado' | 'pendiente' | 'vencido'

export type CourseEnrollmentStatus = 'disponible' | 'matriculado' | 'sin_cupo'

export type GradeDisplayStatus = 'aprobado' | 'reprobado' | 'en_curso' | 'pendiente'
