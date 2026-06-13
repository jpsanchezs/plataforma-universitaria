import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { canAccessRoute } from '@/utils/permissions'
import { ROUTES } from '@/utils/routes'

export function RoleRoute() {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (!canAccessRoute(user.role, location.pathname)) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />
  }

  return <Outlet />
}
