import { useEffect, type ReactNode } from 'react'
import { FiX } from 'react-icons/fi'
import { cn } from '@/utils/cn'

interface ModalProps {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
  footer?: ReactNode
  className?: string
}

export function Modal({ open, title, children, onClose, footer, className }: ModalProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
        aria-label="Cerrar modal"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          'relative z-10 w-full max-w-lg rounded-xl border border-primary/10 bg-card shadow-xl',
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-primary/10 px-5 py-4">
          <h2 id="modal-title" className="text-lg font-semibold text-primary">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-primary/10 hover:text-primary"
            aria-label="Cerrar"
          >
            <FiX size={18} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer ? (
          <div className="border-t border-primary/10 px-5 py-4">{footer}</div>
        ) : null}
      </div>
    </div>
  )
}
