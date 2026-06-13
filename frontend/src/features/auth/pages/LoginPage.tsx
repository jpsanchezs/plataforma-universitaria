import { useState, type FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { mockUsers } from '@/data/mockUsers'
import { useAuth } from '@/features/auth/useAuth'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PublicShell } from '@/components/layout/PublicShell'
import { canAccessRoute, ROLE_LABELS } from '@/utils/permissions'

export function LoginPage() {
  const { isAuthenticated, login, loginAsDemo, user } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const redirectPath = (() => {
    if (!user) {
      return null
    }
    const from = (location.state as { from?: string } | null)?.from
    if (from && canAccessRoute(user.role, from)) {
      return from
    }
    return user.defaultPath
  })()

  if (isAuthenticated && user && redirectPath) {
    return <Navigate to={redirectPath} replace />
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const success = login(email, password)
    if (!success) {
      setError('Credenciales incorrectas. Verifique el correo y la contraseña demo.')
    }
  }

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('demo123')
    const success = loginAsDemo(demoEmail)
    if (!success) {
      setError('No se pudo iniciar sesión con el usuario demo seleccionado.')
    }
  }

  return (
    <PublicShell>
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
        <section>
          <Badge variant="default" className="mb-4">
            Acceso simulado
          </Badge>
          <h2 className="text-3xl font-bold text-primary">Iniciar sesión</h2>
          <p className="mt-3 text-sm text-muted sm:text-base">
            Use un usuario demo para explorar la plataforma según su rol. La
            contraseña demo es <strong>demo123</strong> para todos los usuarios.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setError('')
                }}
                className="w-full rounded-lg border border-primary/20 bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="usuario@utlm.demo"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-text"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setError('')
                }}
                className="w-full rounded-lg border border-primary/20 bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="demo123"
                required
              />
            </div>

            {error ? (
              <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full sm:w-auto">
              Entrar
            </Button>
          </form>
        </section>

        <section className="rounded-xl border border-primary/10 bg-card p-5 shadow-sm">
          <h3 className="text-base font-semibold text-text">Acceso rápido demo</h3>
          <p className="mt-2 text-sm text-muted">
            Seleccione un rol para ingresar directamente al módulo correspondiente.
          </p>
          <div className="mt-4 space-y-2">
            {mockUsers.map((demoUser) => (
              <button
                key={demoUser.id}
                type="button"
                onClick={() => handleDemoLogin(demoUser.email)}
                className="flex w-full items-center justify-between rounded-lg border border-primary/10 px-4 py-3 text-left transition-colors hover:bg-primary/5"
              >
                <div>
                  <p className="text-sm font-medium text-text">{demoUser.fullName}</p>
                  <p className="text-xs text-muted">{demoUser.email}</p>
                </div>
                <Badge variant="default">{ROLE_LABELS[demoUser.role]}</Badge>
              </button>
            ))}
          </div>
        </section>
      </div>
    </PublicShell>
  )
}
