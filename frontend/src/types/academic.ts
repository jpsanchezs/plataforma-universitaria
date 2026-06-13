import type { EntityStatus, ID, ISODateString } from '@/types/common'

export type DayOfWeek =
  | 'Lunes'
  | 'Martes'
  | 'Miércoles'
  | 'Jueves'
  | 'Viernes'
  | 'Sábado'

export type EnrollmentStatus =
  | 'matriculado'
  | 'retirado'
  | 'aprobado'
  | 'reprobado'

export type AttendanceStatus = 'presente' | 'ausente' | 'justificado'

export type PeriodStatus = 'activo' | 'cerrado' | 'planificado'

export interface Student {
  id: ID
  userId: ID | null
  carnet: string
  fullName: string
  email: string
  career: string
  semester: number
  gpa: number
  status: EntityStatus
  phone: string
  campus: string
  enrollmentDate: ISODateString
}

export interface Teacher {
  id: ID
  userId: ID | null
  fullName: string
  email: string
  department: string
  specialty: string
  status: EntityStatus
  hireDate: ISODateString
}

export interface AcademicPeriod {
  id: ID
  name: string
  startDate: ISODateString
  endDate: ISODateString
  status: PeriodStatus
}

export interface Course {
  id: ID
  code: string
  name: string
  credits: number
  periodId: ID
  teacherId: ID
  capacity: number
  enrolled: number
  room: string
  status: EntityStatus
}

export interface Enrollment {
  id: ID
  studentId: ID
  courseId: ID
  periodId: ID
  status: EnrollmentStatus
  enrolledAt: ISODateString
}

export interface ScheduleBlock {
  id: ID
  courseId: ID
  day: DayOfWeek
  startTime: string
  endTime: string
  room: string
}

export interface Grade {
  id: ID
  enrollmentId: ID
  studentId: ID
  courseId: ID
  partial1: number | null
  partial2: number | null
  finalExam: number | null
  finalGrade: number | null
  published: boolean
}

export interface AttendanceRecord {
  id: ID
  courseId: ID
  studentId: ID
  date: ISODateString
  status: AttendanceStatus
  registered: boolean
}

export interface AcademicHistoryItem {
  id: ID
  studentId: ID
  periodId: ID
  courseCode: string
  courseName: string
  credits: number
  finalGrade: number
  status: 'aprobado' | 'reprobado'
}
