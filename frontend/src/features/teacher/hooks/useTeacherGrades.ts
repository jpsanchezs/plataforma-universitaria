import { useCallback, useMemo, useState } from 'react'
import type { ID } from '@/types/common'
import {
  computeGradeDisplayStatus,
  getCoursesByTeacherId,
  getEffectiveGradeValues,
  getStudentsByCourseId,
  teacherOwnsCourse,
} from '@/data/selectors'
import {
  MAX_GRADE,
  MIN_GRADE,
  TEACHER_GRADES_STORAGE_KEY,
} from '@/features/teacher/constants'
import type {
  EffectiveGradeRow,
  GradeField,
  GradeSummary,
  StoredGradeOverride,
  TeacherFeedback,
  TeacherGradesStorage,
} from '@/features/teacher/types'
import { gradeStorageKey } from '@/features/teacher/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'

function buildGradeRow(
  studentId: ID,
  courseId: ID,
  storage: TeacherGradesStorage,
): EffectiveGradeRow {
  const values = getEffectiveGradeValues(studentId, courseId, storage)
  const status = computeGradeDisplayStatus(
    values.partial1,
    values.partial2,
    values.finalExam,
    values.finalGrade,
  )

  return { studentId, ...values, status }
}

function buildSummary(rows: EffectiveGradeRow[]): GradeSummary {
  const completed = rows.filter((row) => row.finalGrade !== null)
  const average =
    completed.length > 0
      ? completed.reduce((sum, row) => sum + (row.finalGrade ?? 0), 0) / completed.length
      : null

  return {
    average,
    approved: rows.filter((row) => row.status === 'aprobado').length,
    failed: rows.filter((row) => row.status === 'reprobado').length,
    inProgress: rows.filter(
      (row) => row.status === 'en_curso' || row.status === 'pendiente',
    ).length,
  }
}

export function useTeacherGrades(teacherId: ID | undefined) {
  const [storage, setStorage] = useLocalStorage<TeacherGradesStorage>(
    TEACHER_GRADES_STORAGE_KEY,
    {},
  )
  const [selectedCourseId, setSelectedCourseId] = useState<ID>('')
  const [feedback, setFeedback] = useState<TeacherFeedback | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const courses = useMemo(() => {
    if (!teacherId) {
      return []
    }
    return getCoursesByTeacherId(teacherId)
  }, [teacherId])

  const resolveCourseId = useCallback(
    (requestedCourseId: ID | null): ID => {
      if (requestedCourseId && teacherId && teacherOwnsCourse(teacherId, requestedCourseId)) {
        return requestedCourseId
      }
      return courses[0]?.id ?? ''
    },
    [courses, teacherId],
  )

  const activeCourseId = useMemo(() => {
    const candidate = selectedCourseId || courses[0]?.id || ''
    if (candidate && teacherId && teacherOwnsCourse(teacherId, candidate)) {
      return candidate
    }
    return courses[0]?.id ?? ''
  }, [selectedCourseId, courses, teacherId])

  const rows = useMemo((): EffectiveGradeRow[] => {
    if (!activeCourseId || !teacherId || !teacherOwnsCourse(teacherId, activeCourseId)) {
      return []
    }
    return getStudentsByCourseId(activeCourseId).map((student) =>
      buildGradeRow(student.id, activeCourseId, storage),
    )
  }, [activeCourseId, storage, teacherId])

  const students = useMemo(() => {
    if (!activeCourseId || !teacherId || !teacherOwnsCourse(teacherId, activeCourseId)) {
      return []
    }
    return getStudentsByCourseId(activeCourseId)
  }, [activeCourseId, teacherId])

  const summary = useMemo(() => buildSummary(rows), [rows])

  const updateGrade = useCallback(
    (courseId: ID, studentId: ID, field: GradeField, rawValue: string) => {
      if (!teacherId || !teacherOwnsCourse(teacherId, courseId)) {
        setFeedback({ type: 'error', message: 'No puede editar calificaciones de este curso.' })
        return
      }

      const errorKey = `${courseId}:${studentId}:${field}`

      if (rawValue.trim() === '') {
        setFieldErrors((current) => {
          const next = { ...current }
          delete next[errorKey]
          return next
        })
        const key = gradeStorageKey(courseId, studentId)
        setStorage((current) => {
          const existing = current[key] ?? {}
          return {
            ...current,
            [key]: { ...existing, [field]: null },
          }
        })
        setFeedback({ type: 'success', message: 'Calificación actualizada.' })
        return
      }

      const numericValue = Number(rawValue)
      if (Number.isNaN(numericValue) || numericValue < MIN_GRADE || numericValue > MAX_GRADE) {
        setFieldErrors((current) => ({
          ...current,
          [errorKey]: `Ingrese un valor entre ${MIN_GRADE} y ${MAX_GRADE}.`,
        }))
        setFeedback({ type: 'error', message: 'Hay valores fuera de rango.' })
        return
      }

      setFieldErrors((current) => {
        const next = { ...current }
        delete next[errorKey]
        return next
      })

      const key = gradeStorageKey(courseId, studentId)
      setStorage((current) => {
        const existing: StoredGradeOverride = current[key] ?? {}
        return {
          ...current,
          [key]: { ...existing, [field]: numericValue },
        }
      })
      setFeedback({ type: 'success', message: 'Calificación guardada correctamente.' })
    },
    [setStorage, teacherId],
  )

  const selectCourse = useCallback(
    (courseId: ID): boolean => {
      if (!teacherId || !teacherOwnsCourse(teacherId, courseId)) {
        setFeedback({
          type: 'error',
          message: 'No tiene permiso para editar calificaciones de ese curso.',
        })
        return false
      }
      setSelectedCourseId(courseId)
      setFeedback(null)
      setFieldErrors({})
      return true
    },
    [teacherId],
  )

  const clearFeedback = useCallback(() => setFeedback(null), [])

  const isCourseAllowed = useCallback(
    (courseId: ID | null) =>
      Boolean(courseId && teacherId && teacherOwnsCourse(teacherId, courseId)),
    [teacherId],
  )

  const getFieldError = useCallback(
    (studentId: ID, field: GradeField) =>
      fieldErrors[`${activeCourseId}:${studentId}:${field}`],
    [fieldErrors, activeCourseId],
  )

  return {
    courses,
    activeCourseId,
    students,
    rows,
    summary,
    feedback,
    selectCourse,
    resolveCourseId,
    updateGrade,
    clearFeedback,
    isCourseAllowed,
    getFieldError,
  }
}
