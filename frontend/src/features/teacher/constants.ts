export {
  TEACHER_ATTENDANCE_STORAGE_KEY,
  TEACHER_GRADES_STORAGE_KEY,
} from '@/utils/storageKeys'

export const PASSING_GRADE = 70

export const GRADE_WEIGHTS = {
  partial1: 0.3,
  partial2: 0.3,
  finalExam: 0.4,
} as const

export const MIN_GRADE = 0

export const MAX_GRADE = 100

export const DEFAULT_ATTENDANCE_DATE = '2026-02-03'
