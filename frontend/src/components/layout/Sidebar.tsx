import { useAuth } from '@/features/auth/useAuth'
import { NavItem } from '@/components/layout/NavItem'
import { getNavItemsForRole } from '@/utils/permissions'
import { cn } from '@/utils/cn'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  const navItems = getNavItemsForRole(user.role)

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-primary/40 backdrop-blur-sm transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-primary/10 bg-card shadow-xl transition-transform lg:static lg:z-auto lg:translate-x-0 lg:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="border-b border-primary/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
              U
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">
                UTLM
              </p>
              <p className="text-sm font-semibold text-primary">
                Plataforma Universitaria
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <NavItem key={item.path} item={item} onNavigate={onClose} />
          ))}
        </nav>

        <div className="border-t border-primary/10 px-5 py-4 text-xs text-muted">
          Prototipo · Datos simulados
        </div>
      </aside>
    </>
  )
}
