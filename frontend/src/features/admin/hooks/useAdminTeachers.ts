import { useCallback, useMemo, useState } from 'react'
import type { Teacher } from '@/types/academic'
import type { EntityStatus, ID } from '@/types/common'
import {
  getAdminTeachersSummary,
  getCoursesCountByTeacherId,
  getDepartments,
  getEffectiveTeachers,
} from '@/data/selectors'
import {
  ADMIN_COURSES_STORAGE_KEY,
  ADMIN_TEACHERS_STORAGE_KEY,
} from '@/features/admin/constants'
import type {
  AdminCoursesStorage,
  AdminFeedback,
  AdminTeachersStorage,
  TeacherFormValues,
} from '@/features/admin/types'
import {
  emptyAdminCoursesStorage,
  emptyAdminTeachersStorage,
} from '@/features/admin/types'
import {
  defaultTeacherFormValues,
  validateTeacherForm,
  type FormErrors,
} from '@/features/admin/utils/validation'
import { useLocalStorage } from '@/hooks/useLocalStorage'

function applyTeacherPatch(
  storage: AdminTeachersStorage,
  teacherId: ID,
  patch: Partial<Teacher>,
): AdminTeachersStorage {
  const isCreated = storage.created.some((teacher) => teacher.id === teacherId)

  if (isCreated) {
    return {
      ...storage,
      created: storage.created.map((teacher) =>
        teacher.id === teacherId ? { ...teacher, ...patch } : teacher,
      ),
    }
  }

  return {
    ...storage,
    updated: {
      ...storage.updated,
      [teacherId]: { ...storage.updated[teacherId], ...patch },
    },
  }
}

export function useAdminTeachers() {
  const [storage, setStorage] = useLocalStorage<AdminTeachersStorage>(
    ADMIN_TEACHERS_STORAGE_KEY,
    emptyAdminTeachersStorage(),
  )
  const [courseStorage] = useLocalStorage<AdminCoursesStorage>(
    ADMIN_COURSES_STORAGE_KEY,
    emptyAdminCoursesStorage(),
  )
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null)
  const [formErrors, setFormErrors] = useState<FormErrors<TeacherFormValues>>({})

  const teachers = useMemo(() => getEffectiveTeachers(storage), [storage])
  const summary = useMemo(
    () => getAdminTeachersSummary(storage, courseStorage),
    [storage, courseStorage],
  )
  const departments = useMemo(() => getDepartments(storage), [storage])

  const createTeacher = useCallback(
    (values: TeacherFormValues): boolean => {
      const errors = validateTeacherForm(values)
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        setFeedback({ type: 'error', message: 'Revise los campos del formulario.' })
        return false
      }

      const newTeacher: Teacher = {
        id: `tch-admin-${Date.now()}`,
        userId: null,
        fullName: values.fullName.trim(),
        department: values.department.trim(),
        specialty: values.specialty.trim(),
        email: values.email.trim(),
        status: values.status,
        hireDate: new Date().toISOString().slice(0, 10),
      }

      setStorage((current) => ({
        ...current,
        created: [...current.created, newTeacher],
      }))
      setFormErrors({})
      setFeedback({ type: 'success', message: 'Docente creado correctamente.' })
      return true
    },
    [setStorage],
  )

  const updateTeacher = useCallback(
    (teacherId: ID, values: TeacherFormValues): boolean => {
      const errors = validateTeacherForm(values)
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        setFeedback({ type: 'error', message: 'Revise los campos del formulario.' })
        return false
      }

      setStorage((current) =>
        applyTeacherPatch(current, teacherId, {
          fullName: values.fullName.trim(),
          department: values.department.trim(),
          specialty: values.specialty.trim(),
          email: values.email.trim(),
          status: values.status,
        }),
      )
      setFormErrors({})
      setFeedback({ type: 'success', message: 'Docente actualizado correctamente.' })
      return true
    },
    [setStorage],
  )

  const changeTeacherStatus = useCallback(
    (teacherId: ID, status: EntityStatus) => {
      setStorage((current) => applyTeacherPatch(current, teacherId, { status }))
      const assignedCourses = getCoursesCountByTeacherId(teacherId, courseStorage)
      const message =
        status === 'inactivo' && assignedCourses > 0
          ? `Docente inactivado. Conserva ${assignedCourses} curso(s) asignado(s); no se rompen relaciones.`
          : 'Estado del docente actualizado.'
      setFeedback({ type: 'success', message })
    },
    [courseStorage, setStorage],
  )

  const clearFeedback = useCallback(() => setFeedback(null), [])
  const clearFormErrors = useCallback(() => setFormErrors({}), [])

  return {
    teachers,
    summary,
    departments,
    courseStorage,
    feedback,
    formErrors,
    createTeacher,
    updateTeacher,
    changeTeacherStatus,
    clearFeedback,
    clearFormErrors,
    defaultFormValues: defaultTeacherFormValues,
  }
}
