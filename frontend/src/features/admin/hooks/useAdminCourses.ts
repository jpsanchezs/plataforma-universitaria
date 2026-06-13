import { useCallback, useMemo, useState } from 'react'
import type { Course } from '@/types/academic'
import type { EntityStatus, ID } from '@/types/common'
import {
  getAdminCoursesSummary,
  getCourseEnrollmentCount,
  getEffectiveCourses,
  getEffectivePeriods,
  getEffectiveTeachers,
} from '@/data/selectors'
import {
  ADMIN_COURSES_STORAGE_KEY,
  ADMIN_PERIODS_STORAGE_KEY,
  ADMIN_TEACHERS_STORAGE_KEY,
} from '@/features/admin/constants'
import type {
  AdminCoursesStorage,
  AdminFeedback,
  AdminPeriodsStorage,
  AdminTeachersStorage,
  CourseFormValues,
} from '@/features/admin/types'
import {
  emptyAdminCoursesStorage,
  emptyAdminPeriodsStorage,
  emptyAdminTeachersStorage,
} from '@/features/admin/types'
import {
  defaultCourseFormValues,
  validateCourseForm,
  type FormErrors,
} from '@/features/admin/utils/validation'
import { useLocalStorage } from '@/hooks/useLocalStorage'

function applyCoursePatch(
  storage: AdminCoursesStorage,
  courseId: ID,
  patch: Partial<Course>,
): AdminCoursesStorage {
  const isCreated = storage.created.some((course) => course.id === courseId)

  if (isCreated) {
    return {
      ...storage,
      created: storage.created.map((course) =>
        course.id === courseId ? { ...course, ...patch } : course,
      ),
    }
  }

  return {
    ...storage,
    updated: {
      ...storage.updated,
      [courseId]: { ...storage.updated[courseId], ...patch },
    },
  }
}

export function useAdminCourses() {
  const [storage, setStorage] = useLocalStorage<AdminCoursesStorage>(
    ADMIN_COURSES_STORAGE_KEY,
    emptyAdminCoursesStorage(),
  )
  const [teacherStorage] = useLocalStorage<AdminTeachersStorage>(
    ADMIN_TEACHERS_STORAGE_KEY,
    emptyAdminTeachersStorage(),
  )
  const [periodStorage] = useLocalStorage<AdminPeriodsStorage>(
    ADMIN_PERIODS_STORAGE_KEY,
    emptyAdminPeriodsStorage(),
  )
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null)
  const [formErrors, setFormErrors] = useState<FormErrors<CourseFormValues>>({})

  const courses = useMemo(() => getEffectiveCourses(storage), [storage])
  const teachers = useMemo(() => getEffectiveTeachers(teacherStorage), [teacherStorage])
  const periods = useMemo(() => getEffectivePeriods(periodStorage), [periodStorage])
  const summary = useMemo(
    () => getAdminCoursesSummary(storage, periodStorage),
    [storage, periodStorage],
  )

  const createCourse = useCallback(
    (values: CourseFormValues): boolean => {
      const errors = validateCourseForm(values, courses, teachers, periods)
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        setFeedback({ type: 'error', message: 'Revise los campos del formulario.' })
        return false
      }

      const newCourse: Course = {
        id: `crs-admin-${Date.now()}`,
        code: values.code.trim().toUpperCase(),
        name: values.name.trim(),
        credits: values.credits,
        teacherId: values.teacherId,
        periodId: values.periodId,
        capacity: values.capacity,
        enrolled: 0,
        room: values.room.trim() || 'Por confirmar',
        status: values.status,
      }

      setStorage((current) => ({
        ...current,
        created: [...current.created, newCourse],
      }))
      setFormErrors({})
      setFeedback({
        type: 'success',
        message:
          'Curso creado en admin. Aún no aparece en matrícula, horarios ni portal docente hasta sincronización global.',
      })
      return true
    },
    [courses, periods, setStorage, teachers],
  )

  const updateCourse = useCallback(
    (courseId: ID, values: CourseFormValues): boolean => {
      const errors = validateCourseForm(values, courses, teachers, periods, courseId)
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        setFeedback({ type: 'error', message: 'Revise los campos del formulario.' })
        return false
      }

      const enrolled = Math.max(
        courses.find((course) => course.id === courseId)?.enrolled ?? 0,
        getCourseEnrollmentCount(courseId),
      )

      setStorage((current) =>
        applyCoursePatch(current, courseId, {
          code: values.code.trim().toUpperCase(),
          name: values.name.trim(),
          credits: values.credits,
          teacherId: values.teacherId,
          periodId: values.periodId,
          capacity: values.capacity,
          room: values.room.trim() || 'Por confirmar',
          status: values.status,
          enrolled,
        }),
      )
      setFormErrors({})
      setFeedback({ type: 'success', message: 'Curso actualizado correctamente.' })
      return true
    },
    [courses, periods, setStorage, teachers],
  )

  const changeCourseStatus = useCallback(
    (courseId: ID, status: EntityStatus) => {
      const enrolled = getCourseEnrollmentCount(courseId)
      setStorage((current) => applyCoursePatch(current, courseId, { status }))
      let message =
        status === 'activo' ? 'Curso activado correctamente.' : 'Curso inactivado correctamente.'
      if (status === 'inactivo' && enrolled > 0) {
        message = `Curso inactivado. Se conservan ${enrolled} matrícula(s); no se eliminan relaciones.`
      }
      setFeedback({ type: 'success', message })
    },
    [setStorage],
  )

  const clearFeedback = useCallback(() => setFeedback(null), [])
  const clearFormErrors = useCallback(() => setFormErrors({}), [])

  return {
    courses,
    teachers,
    periods,
    summary,
    storage,
    teacherStorage,
    periodStorage,
    feedback,
    formErrors,
    createCourse,
    updateCourse,
    changeCourseStatus,
    clearFeedback,
    clearFormErrors,
    defaultFormValues: defaultCourseFormValues,
  }
}
