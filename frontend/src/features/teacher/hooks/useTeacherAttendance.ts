import { useCallback, useMemo, useState } from 'react'
import type { AttendanceStatus } from '@/types/academic'
import type { ID, ISODateString } from '@/types/common'
import {
  getCoursesByTeacherId,
  getEffectiveAttendanceStatus,
  getStudentsByCourseId,
  teacherOwnsCourse,
} from '@/data/selectors'
import { DEFAULT_ATTENDANCE_DATE, TEACHER_ATTENDANCE_STORAGE_KEY } from '@/features/teacher/constants'
import type {
  AttendanceRow,
  AttendanceSummary,
  TeacherAttendanceStorage,
  TeacherFeedback,
} from '@/features/teacher/types'
import { attendanceStorageKey } from '@/features/teacher/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'

function buildSummary(rows: AttendanceRow[]): AttendanceSummary {
  const total = rows.length
  const present = rows.filter((row) => row.status === 'presente').length
  const absent = rows.filter((row) => row.status === 'ausente').length
  const justified = rows.filter((row) => row.status === 'justificado').length
  const attendanceRate = total > 0 ? (present / total) * 100 : 0

  return { total, present, absent, justified, attendanceRate }
}

export function useTeacherAttendance(teacherId: ID | undefined) {
  const [storage, setStorage] = useLocalStorage<TeacherAttendanceStorage>(
    TEACHER_ATTENDANCE_STORAGE_KEY,
    {},
  )
  const [selectedCourseId, setSelectedCourseId] = useState<ID>('')
  const [selectedDate, setSelectedDate] = useState<ISODateString>(DEFAULT_ATTENDANCE_DATE)
  const [feedback, setFeedback] = useState<TeacherFeedback | null>(null)

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

  const rows = useMemo((): AttendanceRow[] => {
    if (!activeCourseId || !teacherId || !teacherOwnsCourse(teacherId, activeCourseId)) {
      return []
    }
    return getStudentsByCourseId(activeCourseId).map((student) => ({
      studentId: student.id,
      carnet: student.carnet,
      fullName: student.fullName,
      career: student.career,
      status: getEffectiveAttendanceStatus(
        activeCourseId,
        student.id,
        selectedDate,
        storage,
      ),
      date: selectedDate,
    }))
  }, [activeCourseId, selectedDate, storage, teacherId])

  const summary = useMemo(() => buildSummary(rows), [rows])

  const updateAttendance = useCallback(
    (courseId: ID, studentId: ID, date: ISODateString, status: AttendanceStatus) => {
      if (!teacherId || !teacherOwnsCourse(teacherId, courseId)) {
        setFeedback({ type: 'error', message: 'No puede registrar asistencia en este curso.' })
        return
      }

      const key = attendanceStorageKey(courseId, studentId, date)
      setStorage((current) => ({
        ...current,
        [key]: status,
      }))
      setFeedback({ type: 'success', message: 'Asistencia guardada correctamente.' })
    },
    [setStorage, teacherId],
  )

  const selectCourse = useCallback(
    (courseId: ID): boolean => {
      if (!teacherId || !teacherOwnsCourse(teacherId, courseId)) {
        setFeedback({
          type: 'error',
          message: 'No tiene permiso para registrar asistencia en ese curso.',
        })
        return false
      }
      setSelectedCourseId(courseId)
      setFeedback(null)
      return true
    },
    [teacherId],
  )

  const selectDate = useCallback((date: ISODateString) => {
    setSelectedDate(date)
    setFeedback(null)
  }, [])

  const clearFeedback = useCallback(() => setFeedback(null), [])

  const isCourseAllowed = useCallback(
    (courseId: ID | null) =>
      Boolean(courseId && teacherId && teacherOwnsCourse(teacherId, courseId)),
    [teacherId],
  )

  return {
    courses,
    activeCourseId,
    selectedDate,
    rows,
    summary,
    feedback,
    selectCourse,
    selectDate,
    resolveCourseId,
    updateAttendance,
    clearFeedback,
    isCourseAllowed,
  }
}
