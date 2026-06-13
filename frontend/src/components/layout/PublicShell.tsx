import type { ReactNode } from 'react'

interface PublicShellProps {
  children: ReactNode
}

export function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="border-b border-primary/10 bg-card shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
            U
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-accent">
              Universidad Tecnológica La Mejor
            </p>
            <h1 className="text-lg font-semibold text-primary sm:text-xl">
              Plataforma Universitaria
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        {children}
      </main>

      <footer className="border-t border-primary/10 bg-card">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-muted sm:px-6">
          Prototipo frontend — UTLM · Sin backend · Datos simulados
        </div>
      </footer>
    </div>
  )
}
