import { NavLink } from 'react-router-dom'
import type { NavItemConfig } from '@/utils/permissions'
import { cn } from '@/utils/cn'

interface NavItemProps {
  item: NavItemConfig
  onNavigate?: () => void
}

export function NavItem({ item, onNavigate }: NavItemProps) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary text-white'
            : 'text-primary/80 hover:bg-primary/10 hover:text-primary',
        )
      }
      end={item.path === '/dashboard'}
    >
      <Icon size={18} />
      <span>{item.label}</span>
    </NavLink>
  )
}
