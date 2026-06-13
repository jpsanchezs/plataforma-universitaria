import { useAuth } from '@/features/auth/useAuth'
import { getStudentByUserId } from '@/data/selectors'

export function useCurrentStudent() {
  const { user } = useAuth()
  const student = user ? getStudentByUserId(user.id) : undefined

  return { user, student }
}
