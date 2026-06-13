import { Alert } from '@/components/feedback/Alert'

export type AdminDataScope = 'general' | 'courses' | 'students' | 'teachers' | 'periods'

const SCOPE_MESSAGES: Record<AdminDataScope, string> = {
  general:
    'Los cambios se guardan en localStorage como overrides sobre los mocks. No se eliminan registros base ni relaciones (matrículas, asignaciones); solo se inactivan o actualizan.',
  students:
    'Los estudiantes inactivos o graduados permanecen en el sistema. Sus matrículas en mockEnrollments no se borran al cambiar estado.',
  teachers:
    'Inactivar un docente no desasigna sus cursos. Las asignaciones existentes se conservan en los datos base.',
  courses:
    'Los cursos creados o editados aquí son visibles en este módulo admin. Aún no se sincronizan con matrícula estudiantil, horarios ni portal docente (esos módulos leen los mocks base). Inactivar un curso no elimina matrículas existentes.',
  periods:
    'Los cambios de período aplican en admin. Cursos y matrículas del mock base conservan su periodId original hasta integrar sincronización global.',
}

interface AdminDataScopeAlertProps {
  scope?: AdminDataScope
  className?: string
}

export function AdminDataScopeAlert({
  scope = 'general',
  className,
}: AdminDataScopeAlertProps) {
  return (
    <Alert variant="info" className={className}>
      {SCOPE_MESSAGES[scope]}
    </Alert>
  )
}
