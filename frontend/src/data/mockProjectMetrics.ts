import type { ProjectMetric } from '@/types/project'
import type { ProjectProgressTrendPoint } from '@/features/executive/types'

export const mockProjectMetrics: ProjectMetric[] = [
  // Tiempo (KT-01 a KT-04)
  { id: 'kt-01', category: 'tiempo', name: 'SPI - Indice de desempeno del cronograma', planned: 1.0, actual: 0.92, unit: 'indice', status: 'amarillo' },
  { id: 'kpi-009', category: 'tiempo', name: 'SV - Variacion del cronograma', planned: 0, actual: -350, unit: 'USD', status: 'amarillo' },
  { id: 'kt-03', category: 'tiempo', name: 'Hitos cumplidos a tiempo', planned: 100, actual: 100, unit: '%', status: 'verde' },
  { id: 'kt-04', category: 'tiempo', name: 'Tareas completadas en la semana', planned: 85, actual: 88, unit: '%', status: 'verde' },

  // Costo (KC-01 a KC-03)
  { id: 'kpi-004', category: 'costo', name: 'CPI - Indice de desempeno del costo', planned: 1.0, actual: 0.97, unit: 'indice', status: 'verde' },
  { id: 'kc-02', category: 'costo', name: 'CV - Variacion del costo', planned: 0, actual: -650, unit: 'USD', status: 'amarillo' },
  { id: 'kc-03', category: 'costo', name: 'Ejecucion presupuestal', planned: 65, actual: 62, unit: '%', status: 'verde' },

  // Calidad (KQ-01 a KQ-04)
  { id: 'kq-01', category: 'calidad', name: 'Modulos aprobados sin defectos criticos', planned: 100, actual: 89, unit: '%', status: 'amarillo' },
  { id: 'kq-02', category: 'calidad', name: 'Entregables aprobados a la primera revision', planned: 80, actual: 82, unit: '%', status: 'verde' },
  { id: 'kq-03', category: 'calidad', name: 'Densidad de defectos del Front-End', planned: 2, actual: 2.4, unit: 'defectos/modulo', status: 'amarillo' },
  { id: 'kq-04', category: 'calidad', name: 'Cobertura de pruebas', planned: 90, actual: 78, unit: '%', status: 'amarillo' },

  // Productividad (KP-01 a KP-03)
  { id: 'kp-01', category: 'productividad', name: 'Velocidad de desarrollo', planned: 1, actual: 1, unit: 'modulos/semana', status: 'verde' },
  { id: 'kpi-001', category: 'productividad', name: 'Avance del Front-End', planned: 78, actual: 67, unit: '%', status: 'amarillo' },
  { id: 'kp-03', category: 'productividad', name: 'Entregables completados vs planificados', planned: 90, actual: 100, unit: '%', status: 'verde' },
]

/** Avance planificado vs real por fase del proyecto, alineado al cronograma (E6). */
export const mockProjectProgressTrend: ProjectProgressTrendPoint[] = [
  { phase: 'Inicio', planned: 100, actual: 100 },
  { phase: 'Planificacion', planned: 100, actual: 100 },
  { phase: 'Ejecucion', planned: 67, actual: 60 },
  { phase: 'Monitoreo y Control', planned: 55, actual: 52 },
  { phase: 'Cierre', planned: 0, actual: 0 },
]