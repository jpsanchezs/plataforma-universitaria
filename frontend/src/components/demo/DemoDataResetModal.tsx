import { useState } from 'react'
import { Alert } from '@/components/feedback/Alert'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { resetDemoStorage } from '@/utils/storageKeys'

interface DemoDataResetModalProps {
  open: boolean
  onClose: () => void
}

export function DemoDataResetModal({ open, onClose }: DemoDataResetModalProps) {
  const [keepSession, setKeepSession] = useState(true)
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleReset = () => {
    resetDemoStorage(!keepSession)
    setFeedback('Datos demo restablecidos. Recargando…')
    window.setTimeout(() => {
      if (keepSession) {
        window.location.reload()
      } else {
        window.location.href = '/login'
      }
    }, 600)
  }

  const handleClose = () => {
    setFeedback(null)
    onClose()
  }

  return (
    <Modal
      open={open}
      title="Restablecer datos demo"
      onClose={handleClose}
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleReset}>
            Restablecer
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-sm">
        <p className="text-muted">
          Elimina matrícula simulada, asistencia, notas, cambios administrativos y pagos
          guardados en este navegador. Los mocks base del prototipo no se modifican.
        </p>

        <label className="flex items-start gap-3 rounded-lg border border-primary/10 px-4 py-3">
          <input
            type="checkbox"
            checked={keepSession}
            onChange={(event) => setKeepSession(event.target.checked)}
            className="mt-1"
          />
          <span>
            <span className="font-medium text-text">Mantener sesión activa</span>
            <span className="mt-1 block text-muted">
              Si se desmarca, también se cierra la sesión y se redirige al login.
            </span>
          </span>
        </label>

        {feedback ? (
          <Alert variant="success">{feedback}</Alert>
        ) : (
          <Alert variant="info">
            Esta acción no se puede deshacer. Útil antes de una demostración en vivo.
          </Alert>
        )}
      </div>
    </Modal>
  )
}
