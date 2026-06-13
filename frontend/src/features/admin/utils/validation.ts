import {
  EMAIL_PATTERN,
  MAX_COURSE_CREDITS,
  MAX_GPA,
  MAX_SEMESTER,
  MIN_COURSE_CAPACITY,
  MIN_COURSE_CREDITS,
  MIN_GPA,
  MIN_SEMESTER,
} from '@/features/admin/constants'
import type {
  CourseFormValues,
  PeriodFormValues,
  StudentFormValues,
  TeacherFormValues,
} from '@/features/admin/types'
import type { Student, Teacher, Course, AcademicPeriod } from '@/types/academic'
import type { ID } from '@/types/common'
import { getCourseEnrollmentCount } from '@/data/selectors'

export type FormErrors<T> = Partial<Record<keyof T, string>>

export function validateStudentForm(
  values: StudentFormValues,
  students: Student[],
  editingId?: ID,
): FormErrors<StudentFormValues> {
  const errors: FormErrors<StudentFormValues> = {}

  if (!values.fullName.trim()) {
    errors.fullName = 'El nombre es requerido.'
  }

  if (!values.carnet.trim()) {
    errors.carnet = 'El carnet es requerido.'
  } else if (
    students.some(
      (student) =>
        student.carnet === values.carnet.trim() && student.id !== editingId,
    )
  ) {
    errors.carnet = 'Ya existe un estudiante con este carnet.'
  }

  if (!values.career.trim()) {
    errors.career = 'La carrera es requerida.'
  }

  if (values.semester < MIN_SEMESTER || values.semester > MAX_SEMESTER) {
    errors.semester = `El semestre debe estar entre ${MIN_SEMESTER} y ${MAX_SEMESTER}.`
  }

  if (values.gpa < MIN_GPA || values.gpa > MAX_GPA) {
    errors.gpa = `El GPA debe estar entre ${MIN_GPA} y ${MAX_GPA}.`
  }

  if (!values.campus.trim()) {
    errors.campus = 'El campus es requerido.'
  }

  if (values.email.trim() && !EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Ingrese un correo institucional válido.'
  }

  return errors
}

export function validateTeacherForm(
  values: TeacherFormValues,
): FormErrors<TeacherFormValues> {
  const errors: FormErrors<TeacherFormValues> = {}

  if (!values.fullName.trim()) {
    errors.fullName = 'El nombre es requerido.'
  }

  if (!values.department.trim()) {
    errors.department = 'El departamento es requerido.'
  }

  if (!values.specialty.trim()) {
    errors.specialty = 'La especialidad es requerida.'
  }

  if (!values.email.trim()) {
    errors.email = 'El correo institucional es requerido.'
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Ingrese un correo institucional válido.'
  }

  return errors
}

export function validateCourseForm(
  values: CourseFormValues,
  courses: Course[],
  teachers: Teacher[],
  periods: AcademicPeriod[],
  editingId?: ID,
): FormErrors<CourseFormValues> {
  const errors: FormErrors<CourseFormValues> = {}

  if (!values.code.trim()) {
    errors.code = 'El código es requerido.'
  } else if (
    courses.some(
      (course) =>
        course.code.toLowerCase() === values.code.trim().toLowerCase() &&
        course.id !== editingId,
    )
  ) {
    errors.code = 'Ya existe un curso con este código.'
  }

  if (!values.name.trim()) {
    errors.name = 'El nombre es requerido.'
  }

  if (values.credits < MIN_COURSE_CREDITS || values.credits > MAX_COURSE_CREDITS) {
    errors.credits = `Los créditos deben estar entre ${MIN_COURSE_CREDITS} y ${MAX_COURSE_CREDITS}.`
  }

  if (values.capacity < MIN_COURSE_CAPACITY) {
    errors.capacity = 'La capacidad debe ser mayor que 0.'
  } else if (editingId) {
    const current = courses.find((course) => course.id === editingId)
    const enrolled = current
      ? Math.max(current.enrolled, getCourseEnrollmentCount(editingId))
      : 0
    if (values.capacity < enrolled) {
      errors.capacity = 'La capacidad no puede ser menor que los matriculados actuales.'
    }
  }

  if (!teachers.some((teacher) => teacher.id === values.teacherId)) {
    errors.teacherId = 'Seleccione un docente válido.'
  }

  if (!periods.some((period) => period.id === values.periodId)) {
    errors.periodId = 'Seleccione un período válido.'
  }

  return errors
}

export function validatePeriodForm(
  values: PeriodFormValues,
): FormErrors<PeriodFormValues> {
  const errors: FormErrors<PeriodFormValues> = {}

  if (!values.name.trim()) {
    errors.name = 'El nombre es requerido.'
  }

  if (!values.startDate) {
    errors.startDate = 'La fecha de inicio es requerida.'
  }

  if (!values.endDate) {
    errors.endDate = 'La fecha de fin es requerida.'
  }

  if (values.startDate && values.endDate && values.endDate <= values.startDate) {
    errors.endDate = 'La fecha de fin debe ser posterior a la de inicio.'
  }

  return errors
}

export const defaultStudentFormValues = (): StudentFormValues => ({
  fullName: '',
  carnet: '',
  career: '',
  semester: 1,
  campus: '',
  gpa: 0,
  status: 'activo',
  email: '',
  phone: '',
})

export const defaultTeacherFormValues = (): TeacherFormValues => ({
  fullName: '',
  department: '',
  specialty: '',
  email: '',
  status: 'activo',
})

export const defaultCourseFormValues = (): CourseFormValues => ({
  code: '',
  name: '',
  credits: 3,
  teacherId: '',
  periodId: '',
  capacity: 30,
  room: '',
  status: 'activo',
})

export const defaultPeriodFormValues = (): PeriodFormValues => ({
  name: '',
  startDate: '',
  endDate: '',
  status: 'planificado',
})
