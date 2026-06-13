import { useCallback, useMemo, useState } from 'react'
import type { ID } from '@/types/common'
import type { CourseWithEnrollmentMeta } from '@/data/selectors'
import {
  getAvailableCoursesForStudent,
  getAvailableSeats,
  getCourseById,
  getEffectiveCourseIds,
  getEnrolledCoursesForStudent,
  getStudentEnrollmentSummary,
  hasScheduleConflict,
} from '@/data/selectors'
import {
  MAX_ENROLLED_CREDITS,
  STUDENT_ENROLLMENTS_STORAGE_KEY,
} from '@/features/student/constants'
import type {
  CourseEnrollmentStatus,
  StudentEnrollmentOverrides,
  StudentEnrollmentsStorage,
} from '@/features/student/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface EnrollmentFeedback {
  type: 'success' | 'error'
  message: string
}

function emptyOverrides(): StudentEnrollmentOverrides {
  return { addedCourseIds: [], removedCourseIds: [] }
}

export function useStudentEnrollments(studentId: ID | undefined) {
  const [storage, setStorage] = useLocalStorage<StudentEnrollmentsStorage>(
    STUDENT_ENROLLMENTS_STORAGE_KEY,
    {},
  )
  const [feedback, setFeedback] = useState<EnrollmentFeedback | null>(null)

  const overrides = studentId ? (storage[studentId] ?? emptyOverrides()) : emptyOverrides()

  const persistOverrides = useCallback(
    (nextOverrides: StudentEnrollmentOverrides) => {
      if (!studentId) {
        return
      }
      setStorage((current) => ({
        ...current,
        [studentId]: nextOverrides,
      }))
    },
    [setStorage, studentId],
  )

  const summary = useMemo(() => {
    if (!studentId) {
      return null
    }
    return getStudentEnrollmentSummary(studentId, overrides)
  }, [studentId, overrides])

  const enrolledCourses = useMemo(() => {
    if (!studentId) {
      return []
    }
    return getEnrolledCoursesForStudent(studentId, overrides)
  }, [studentId, overrides])

  const availableCourses = useMemo(() => {
    if (!studentId) {
      return []
    }
    return getAvailableCoursesForStudent(studentId, overrides)
  }, [studentId, overrides])

  const allCourses = useMemo((): CourseWithEnrollmentMeta[] => {
    if (!studentId) {
      return []
    }
    return [...enrolledCourses, ...availableCourses].sort((a, b) =>
      a.code.localeCompare(b.code),
    )
  }, [studentId, enrolledCourses, availableCourses])

  const getCourseStatus = useCallback(
    (courseId: ID): CourseEnrollmentStatus => {
      if (!studentId) {
        return 'disponible'
      }
      const isEnrolled = getEffectiveCourseIds(studentId, overrides).includes(courseId)
      if (isEnrolled) {
        return 'matriculado'
      }
      const course = getCourseById(courseId)
      if (!course || getAvailableSeats(course, overrides) <= 0) {
        return 'sin_cupo'
      }
      return 'disponible'
    },
    [studentId, overrides],
  )

  const enrollCourse = useCallback(
    (courseId: ID) => {
      if (!studentId) {
        return
      }

      const course = getCourseById(courseId)
      if (!course) {
        setFeedback({ type: 'error', message: 'El curso seleccionado no existe.' })
        return
      }

      if (getEffectiveCourseIds(studentId, overrides).includes(courseId)) {
        setFeedback({ type: 'error', message: 'Ya está matriculado en este curso.' })
        return
      }

      if (getAvailableSeats(course, overrides) <= 0) {
        setFeedback({ type: 'error', message: 'El curso no tiene cupos disponibles.' })
        return
      }

      const projectedCredits = (summary?.totalCredits ?? 0) + course.credits
      if (projectedCredits > MAX_ENROLLED_CREDITS) {
        setFeedback({
          type: 'error',
          message: `No puede matricular más de ${MAX_ENROLLED_CREDITS} créditos por período.`,
        })
        return
      }

      if (hasScheduleConflict(studentId, courseId, overrides)) {
        setFeedback({
          type: 'error',
          message: 'Conflicto de horario con otro curso matriculado.',
        })
        return
      }

      const nextOverrides: StudentEnrollmentOverrides = {
        addedCourseIds: overrides.addedCourseIds.includes(courseId)
          ? overrides.addedCourseIds
          : [...overrides.addedCourseIds, courseId],
        removedCourseIds: overrides.removedCourseIds.filter((id) => id !== courseId),
      }

      persistOverrides(nextOverrides)
      setFeedback({
        type: 'success',
        message: `Matrícula exitosa en ${course.code} — ${course.name}.`,
      })
    },
    [studentId, overrides, summary, persistOverrides],
  )

  const dropCourse = useCallback(
    (courseId: ID) => {
      if (!studentId) {
        return
      }

      const isEnrolled = getEffectiveCourseIds(studentId, overrides).includes(courseId)
      if (!isEnrolled) {
        setFeedback({ type: 'error', message: 'No está matriculado en este curso.' })
        return
      }

      const course = getCourseById(courseId)
      const wasAdded = overrides.addedCourseIds.includes(courseId)

      const nextOverrides: StudentEnrollmentOverrides = {
        addedCourseIds: wasAdded
          ? overrides.addedCourseIds.filter((id) => id !== courseId)
          : overrides.addedCourseIds,
        removedCourseIds: wasAdded
          ? overrides.removedCourseIds
          : [...new Set([...overrides.removedCourseIds, courseId])],
      }

      persistOverrides(nextOverrides)
      setFeedback({
        type: 'success',
        message: `Retiro exitoso de ${course?.code ?? 'curso'}.`,
      })
    },
    [studentId, overrides, persistOverrides],
  )

  const clearFeedback = useCallback(() => setFeedback(null), [])

  return {
    overrides,
    summary,
    enrolledCourses,
    availableCourses,
    allCourses,
    feedback,
    clearFeedback,
    enrollCourse,
    dropCourse,
    getCourseStatus,
    isEnrolled: (courseId: ID) =>
      studentId ? getEffectiveCourseIds(studentId, overrides).includes(courseId) : false,
  }
}
