import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PublicShell } from '@/components/layout/PublicShell'
import { ROUTES } from '@/utils/routes'

export function NotFoundPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-xl text-center">
        <Badge variant="warning" className="mb-4">
          404 — Página no encontrada
        </Badge>
        <h2 className="text-2xl font-bold text-primary">
          La ruta solicitada no existe
        </h2>
        <p className="mt-3 text-sm text-muted">
          Verifique la URL o regrese al inicio de la plataforma.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to={ROUTES.LOGIN}>
            <Button variant="primary">Ir al login</Button>
          </Link>
          <Link to={ROUTES.DASHBOARD}>
            <Button variant="secondary">Ir al dashboard</Button>
          </Link>
        </div>
      </div>
    </PublicShell>
  )
}
