import { useAuth } from '@/features/auth/useAuth'
import { getTeacherByUserId } from '@/data/selectors'

export function useCurrentTeacher() {
  const { user } = useAuth()
  const teacher = user ? getTeacherByUserId(user.id) : undefined

  return { user, teacher }
}
