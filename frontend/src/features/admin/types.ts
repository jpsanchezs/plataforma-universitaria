import type {
  AcademicPeriod,
  Course,
  PeriodStatus,
  Student,
  Teacher,
} from '@/types/academic'
import type { EntityStatus, ID } from '@/types/common'

export interface AdminEntityStorage<T extends { id: ID }> {
  /** Registros nuevos creados desde admin (nunca se eliminan físicamente). */
  created: T[]
  /** Parches parciales sobre mocks base o registros creados (p. ej. inactivar). */
  updated: Record<ID, Partial<T>>
}

export type AdminStudentsStorage = AdminEntityStorage<Student>

export type AdminTeachersStorage = AdminEntityStorage<Teacher>

export type AdminCoursesStorage = AdminEntityStorage<Course>

export type AdminPeriodsStorage = AdminEntityStorage<AcademicPeriod>

export interface AdminFeedback {
  type: 'success' | 'error'
  message: string
}

export interface AdminStudentsSummary {
  total: number
  active: number
  inactive: number
  graduated: number
}

export interface AdminTeachersSummary {
  total: number
  active: number
  departments: number
  assignedCourses: number
}

export interface AdminCoursesSummary {
  total: number
  currentPeriodCount: number
  creditsOffered: number
  availableSeats: number
}

export interface AdminPeriodsSummary {
  total: number
  activePeriod: string
  closed: number
  planned: number
}

export interface StudentFormValues {
  fullName: string
  carnet: string
  career: string
  semester: number
  campus: string
  gpa: number
  status: EntityStatus
  email: string
  phone: string
}

export interface TeacherFormValues {
  fullName: string
  department: string
  specialty: string
  email: string
  status: EntityStatus
}

export interface CourseFormValues {
  code: string
  name: string
  credits: number
  teacherId: ID
  periodId: ID
  capacity: number
  room: string
  status: EntityStatus
}

export interface PeriodFormValues {
  name: string
  startDate: string
  endDate: string
  status: PeriodStatus
}

export type StudentStatusFilter = 'todos' | EntityStatus

export type TeacherStatusFilter = 'todos' | EntityStatus

export type CourseAvailabilityFilter = 'todos' | 'con_cupo' | 'sin_cupo'

export function emptyAdminStudentsStorage(): AdminStudentsStorage {
  return { created: [], updated: {} }
}

export function emptyAdminTeachersStorage(): AdminTeachersStorage {
  return { created: [], updated: {} }
}

export function emptyAdminCoursesStorage(): AdminCoursesStorage {
  return { created: [], updated: {} }
}

export function emptyAdminPeriodsStorage(): AdminPeriodsStorage {
  return { created: [], updated: {} }
}

export function studentToFormValues(student: Student): StudentFormValues {
  return {
    fullName: student.fullName,
    carnet: student.carnet,
    career: student.career,
    semester: student.semester,
    campus: student.campus,
    gpa: student.gpa,
    status: student.status,
    email: student.email,
    phone: student.phone,
  }
}

export function teacherToFormValues(teacher: Teacher): TeacherFormValues {
  return {
    fullName: teacher.fullName,
    department: teacher.department,
    specialty: teacher.specialty,
    email: teacher.email,
    status: teacher.status,
  }
}

export function courseToFormValues(course: Course): CourseFormValues {
  return {
    code: course.code,
    name: course.name,
    credits: course.credits,
    teacherId: course.teacherId,
    periodId: course.periodId,
    capacity: course.capacity,
    room: course.room,
    status: course.status,
  }
}

export function periodToFormValues(period: AcademicPeriod): PeriodFormValues {
  return {
    name: period.name,
    startDate: period.startDate,
    endDate: period.endDate,
    status: period.status,
  }
}
