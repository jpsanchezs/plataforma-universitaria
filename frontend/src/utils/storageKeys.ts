/**
 * Claves localStorage del prototipo UTLM.
 * La sesión no se incluye en el reset demo salvo que el usuario lo pida explícitamente.
 */

export const SESSION_STORAGE_KEY = 'utlm_session'

export const STUDENT_ENROLLMENTS_STORAGE_KEY = 'utlm_student_enrollments'

export const TEACHER_ATTENDANCE_STORAGE_KEY = 'utlm_teacher_attendance'

export const TEACHER_GRADES_STORAGE_KEY = 'utlm_teacher_grades'

export const ADMIN_STUDENTS_STORAGE_KEY = 'utlm_admin_students'

export const ADMIN_TEACHERS_STORAGE_KEY = 'utlm_admin_teachers'

export const ADMIN_COURSES_STORAGE_KEY = 'utlm_admin_courses'

export const ADMIN_PERIODS_STORAGE_KEY = 'utlm_admin_periods'

export const FINANCE_PAYMENTS_STORAGE_KEY = 'utlm_finance_payments'

/** Datos simulados del prototipo; no incluye utlm_session por defecto. */
export const DEMO_RESETTABLE_STORAGE_KEYS = [
  STUDENT_ENROLLMENTS_STORAGE_KEY,
  TEACHER_ATTENDANCE_STORAGE_KEY,
  TEACHER_GRADES_STORAGE_KEY,
  ADMIN_STUDENTS_STORAGE_KEY,
  ADMIN_TEACHERS_STORAGE_KEY,
  ADMIN_COURSES_STORAGE_KEY,
  ADMIN_PERIODS_STORAGE_KEY,
  FINANCE_PAYMENTS_STORAGE_KEY,
] as const

export function resetDemoStorage(includeSession = false): void {
  for (const key of DEMO_RESETTABLE_STORAGE_KEYS) {
    try {
      localStorage.removeItem(key)
    } catch {
      // Ignorar errores de almacenamiento
    }
  }

  if (includeSession) {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY)
    } catch {
      // Ignorar errores de almacenamiento
    }
  }
}
