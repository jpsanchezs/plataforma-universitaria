import type { ProjectMetric } from '@/types/project'
import type { ProjectProgressTrendPoint } from '@/features/executive/types'

export const mockProjectMetrics: ProjectMetric[] = [
  { id: 'kpi-001', category: 'tiempo', name: 'Avance del cronograma', planned: 70, actual: 68, unit: '%', status: 'amarillo' },
  { id: 'kpi-002', category: 'tiempo', name: 'Hitos completados', planned: 8, actual: 7, unit: 'hitos', status: 'amarillo' },
  { id: 'kpi-003', category: 'costo', name: 'Presupuesto ejecutado', planned: 65, actual: 62, unit: '%', status: 'verde' },
  { id: 'kpi-004', category: 'costo', name: 'Variación de costo', planned: 5, actual: 3.2, unit: '%', status: 'verde' },
  { id: 'kpi-005', category: 'calidad', name: 'Defectos abiertos', planned: 10, actual: 14, unit: 'defectos', status: 'rojo' },
  { id: 'kpi-006', category: 'calidad', name: 'Cobertura de pruebas', planned: 80, actual: 72, unit: '%', status: 'amarillo' },
  { id: 'kpi-007', category: 'productividad', name: 'Historias completadas', planned: 45, actual: 41, unit: 'historias', status: 'amarillo' },
  { id: 'kpi-008', category: 'productividad', name: 'Velocidad del equipo', planned: 22, actual: 20, unit: 'pts/sprint', status: 'amarillo' },
  { id: 'kpi-009', category: 'tiempo', name: 'Desviación en días', planned: 0, actual: 5, unit: 'días', status: 'rojo' },
  { id: 'kpi-010', category: 'calidad', name: 'Satisfacción del cliente', planned: 90, actual: 88, unit: '%', status: 'verde' },
]

/** Avance planificado vs real por fase del proyecto (datos mock centralizados). */
export const mockProjectProgressTrend: ProjectProgressTrendPoint[] = [
  { phase: 'Fases 1-3', planned: 30, actual: 28 },
  { phase: 'Fases 4-5', planned: 55, actual: 52 },
  { phase: 'Fases 6-7', planned: 75, actual: 68 },
  { phase: 'Fase 8+', planned: 100, actual: 68 },
]
