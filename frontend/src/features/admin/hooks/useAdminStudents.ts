import { useCallback, useMemo, useState } from 'react'
import type { Student } from '@/types/academic'
import type { EntityStatus, ID } from '@/types/common'
import {
  getAdminStudentsSummary,
  getCampuses,
  getCareers,
  getEffectiveStudents,
  getStudentEnrollmentCount,
} from '@/data/selectors'
import { ADMIN_STUDENTS_STORAGE_KEY } from '@/features/admin/constants'
import type {
  AdminFeedback,
  AdminStudentsStorage,
  StudentFormValues,
} from '@/features/admin/types'
import { emptyAdminStudentsStorage } from '@/features/admin/types'
import {
  defaultStudentFormValues,
  validateStudentForm,
  type FormErrors,
} from '@/features/admin/utils/validation'
import { useLocalStorage } from '@/hooks/useLocalStorage'

function applyStudentPatch(
  storage: AdminStudentsStorage,
  studentId: ID,
  patch: Partial<Student>,
): AdminStudentsStorage {
  const isCreated = storage.created.some((student) => student.id === studentId)

  if (isCreated) {
    return {
      ...storage,
      created: storage.created.map((student) =>
        student.id === studentId ? { ...student, ...patch } : student,
      ),
    }
  }

  return {
    ...storage,
    updated: {
      ...storage.updated,
      [studentId]: { ...storage.updated[studentId], ...patch },
    },
  }
}

export function useAdminStudents() {
  const [storage, setStorage] = useLocalStorage<AdminStudentsStorage>(
    ADMIN_STUDENTS_STORAGE_KEY,
    emptyAdminStudentsStorage(),
  )
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null)
  const [formErrors, setFormErrors] = useState<FormErrors<StudentFormValues>>({})

  const students = useMemo(() => getEffectiveStudents(storage), [storage])
  const summary = useMemo(() => getAdminStudentsSummary(storage), [storage])
  const careers = useMemo(() => getCareers(storage), [storage])
  const campuses = useMemo(() => getCampuses(storage), [storage])

  const createStudent = useCallback(
    (values: StudentFormValues): boolean => {
      const errors = validateStudentForm(values, students)
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        setFeedback({ type: 'error', message: 'Revise los campos del formulario.' })
        return false
      }

      const newStudent: Student = {
        id: `std-admin-${Date.now()}`,
        userId: null,
        fullName: values.fullName.trim(),
        carnet: values.carnet.trim(),
        career: values.career.trim(),
        semester: values.semester,
        campus: values.campus.trim(),
        gpa: values.gpa,
        status: values.status,
        email: values.email.trim(),
        phone: values.phone.trim(),
        enrollmentDate: new Date().toISOString().slice(0, 10),
      }

      setStorage((current) => ({
        ...current,
        created: [...current.created, newStudent],
      }))
      setFormErrors({})
      setFeedback({ type: 'success', message: 'Estudiante creado correctamente.' })
      return true
    },
    [setStorage, students],
  )

  const updateStudent = useCallback(
    (studentId: ID, values: StudentFormValues): boolean => {
      const errors = validateStudentForm(values, students, studentId)
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        setFeedback({ type: 'error', message: 'Revise los campos del formulario.' })
        return false
      }

      setStorage((current) =>
        applyStudentPatch(current, studentId, {
          fullName: values.fullName.trim(),
          carnet: values.carnet.trim(),
          career: values.career.trim(),
          semester: values.semester,
          campus: values.campus.trim(),
          gpa: values.gpa,
          status: values.status,
          email: values.email.trim(),
          phone: values.phone.trim(),
        }),
      )
      setFormErrors({})
      setFeedback({ type: 'success', message: 'Estudiante actualizado correctamente.' })
      return true
    },
    [setStorage, students],
  )

  const changeStudentStatus = useCallback(
    (studentId: ID, status: EntityStatus) => {
      setStorage((current) => applyStudentPatch(current, studentId, { status }))
      const enrollmentCount = getStudentEnrollmentCount(studentId)
      const message =
        enrollmentCount > 0 && (status === 'inactivo' || status === 'graduado')
          ? `Estado actualizado. El estudiante conserva ${enrollmentCount} matrícula(s); no se eliminan relaciones.`
          : 'Estado del estudiante actualizado.'
      setFeedback({ type: 'success', message })
    },
    [setStorage],
  )

  const clearFeedback = useCallback(() => setFeedback(null), [])
  const clearFormErrors = useCallback(() => setFormErrors({}), [])

  return {
    students,
    summary,
    careers,
    campuses,
    feedback,
    formErrors,
    createStudent,
    updateStudent,
    changeStudentStatus,
    clearFeedback,
    clearFormErrors,
    defaultFormValues: defaultStudentFormValues,
  }
}
