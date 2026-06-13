import { useState } from 'react'
import { FiDatabase, FiLogOut, FiMenu } from 'react-icons/fi'
import { useAuth } from '@/features/auth/useAuth'
import { DemoDataResetModal } from '@/components/demo/DemoDataResetModal'
import { Button } from '@/components/ui/Button'
import { RoleBadge } from '@/components/ui/RoleBadge'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth()
  const [resetOpen, setResetOpen] = useState(false)

  if (!user) {
    return null
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-primary/10 bg-card/95 backdrop-blur">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onMenuClick}
              className="inline-flex shrink-0 rounded-lg p-2 text-primary hover:bg-primary/10 lg:hidden"
              aria-label="Abrir menú"
            >
              <FiMenu size={20} />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text">{user.fullName}</p>
              <div className="mt-1">
                <RoleBadge role={user.role} />
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              onClick={() => setResetOpen(true)}
              className="hidden px-2 text-xs sm:inline-flex sm:px-3 sm:text-sm"
              title="Restablecer datos demo"
            >
              <FiDatabase size={16} />
              Datos demo
            </Button>
            <button
              type="button"
              onClick={() => setResetOpen(true)}
              className="inline-flex rounded-lg p-2 text-primary hover:bg-primary/10 sm:hidden"
              aria-label="Restablecer datos demo"
            >
              <FiDatabase size={18} />
            </button>
            <div
              className="hidden h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white sm:flex"
              aria-hidden
            >
              {user.avatarInitials}
            </div>
            <Button
              variant="secondary"
              onClick={logout}
              className="hidden sm:inline-flex"
            >
              <FiLogOut size={16} />
              Cerrar sesión
            </Button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex rounded-lg p-2 text-primary hover:bg-primary/10 sm:hidden"
              aria-label="Cerrar sesión"
            >
              <FiLogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <DemoDataResetModal open={resetOpen} onClose={() => setResetOpen(false)} />
    </>
  )
}
