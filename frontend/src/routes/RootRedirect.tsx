import { Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { ROUTES } from '@/utils/routes'

export function RootRedirect() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return <Navigate to={ROUTES.LOGIN} replace />
}
