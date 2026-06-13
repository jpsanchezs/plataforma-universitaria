import { useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { ID } from '@/types/common'

interface UseTeacherCourseQueryOptions {
  teacherId: ID | undefined
  coursesCount: number
  resolveCourseId: (requestedCourseId: ID | null) => ID
  selectCourse: (courseId: ID) => boolean
  isCourseAllowed: (courseId: ID | null) => boolean
}

export function useTeacherCourseQuery({
  teacherId,
  coursesCount,
  resolveCourseId,
  selectCourse,
  isCourseAllowed,
}: UseTeacherCourseQueryOptions) {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryCourseId = searchParams.get('courseId')
  const invalidCourseFromQuery = Boolean(queryCourseId && !isCourseAllowed(queryCourseId))

  useEffect(() => {
    if (!teacherId || coursesCount === 0) {
      return
    }

    if (queryCourseId && !isCourseAllowed(queryCourseId)) {
      const fallback = resolveCourseId(null)
      selectCourse(fallback)
      if (fallback) {
        setSearchParams({ courseId: fallback }, { replace: true })
      } else {
        setSearchParams({}, { replace: true })
      }
      return
    }

    const resolved = resolveCourseId(queryCourseId)
    selectCourse(resolved)

    if (resolved && queryCourseId !== resolved) {
      setSearchParams({ courseId: resolved }, { replace: true })
    }
  }, [
    teacherId,
    coursesCount,
    queryCourseId,
    isCourseAllowed,
    resolveCourseId,
    selectCourse,
    setSearchParams,
  ])

  const syncCourseToQuery = useCallback(
    (courseId: ID) => {
      if (!selectCourse(courseId)) {
        return
      }
      setSearchParams({ courseId }, { replace: true })
    },
    [selectCourse, setSearchParams],
  )

  return { queryCourseId, invalidCourseFromQuery, syncCourseToQuery }
}
