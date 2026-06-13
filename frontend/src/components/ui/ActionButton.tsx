import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function ActionButton({
  icon,
  children,
  variant = 'secondary',
  className,
  ...props
}: ActionButtonProps) {
  return (
    <Button variant={variant} className={cn('gap-2', className)} {...props}>
      {icon}
      {children}
    </Button>
  )
}
