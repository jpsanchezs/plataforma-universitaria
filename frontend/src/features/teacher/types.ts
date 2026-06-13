import type { AttendanceStatus } from '@/types/academic'
import type { ID, ISODateString } from '@/types/common'
import type { GradeDisplayStatus } from '@/features/student/types'

export type GradeField = 'partial1' | 'partial2' | 'finalExam'

export interface StoredGradeOverride {
  partial1?: number | null
  partial2?: number | null
  finalExam?: number | null
}

export type TeacherGradesStorage = Record<string, StoredGradeOverride>

export type TeacherAttendanceStorage = Record<string, AttendanceStatus>

export interface TeacherCourseViewModel {
  id: ID
  code: string
  name: string
  credits: number
  scheduleSummary: string
  capacity: number
  enrolledCount: number
  availableSeats: number
  status: string
  room: string
}

export interface AttendanceSummary {
  total: number
  present: number
  absent: number
  justified: number
  attendanceRate: number
}

export interface GradeSummary {
  average: number | null
  approved: number
  failed: number
  inProgress: number
}

export interface EffectiveGradeRow {
  studentId: ID
  partial1: number | null
  partial2: number | null
  finalExam: number | null
  finalGrade: number | null
  status: GradeDisplayStatus
}

export interface AttendanceRow {
  studentId: ID
  carnet: string
  fullName: string
  career: string
  status: AttendanceStatus
  date: ISODateString
}

export interface TeacherFeedback {
  type: 'success' | 'error'
  message: string
}

export function attendanceStorageKey(
  courseId: ID,
  studentId: ID,
  date: ISODateString,
): string {
  return `${courseId}|${date}|${studentId}`
}

export function gradeStorageKey(courseId: ID, studentId: ID): string {
  return `${courseId}:${studentId}`
}
