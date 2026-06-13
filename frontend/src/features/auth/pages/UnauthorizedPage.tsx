import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PublicShell } from '@/components/layout/PublicShell'
import { ROUTES } from '@/utils/routes'

export function UnauthorizedPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-xl text-center">
        <Badge variant="danger" className="mb-4">
          403 — Acceso denegado
        </Badge>
        <h2 className="text-2xl font-bold text-primary">
          No tiene permiso para ver esta página
        </h2>
        <p className="mt-3 text-sm text-muted">
          Su rol actual no tiene acceso al módulo solicitado. Use el menú lateral
          para navegar a las secciones disponibles.
        </p>
        <div className="mt-6">
          <Link to={ROUTES.DASHBOARD}>
            <Button variant="primary">Ir al dashboard</Button>
          </Link>
        </div>
      </div>
    </PublicShell>
  )
}
