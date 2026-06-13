import type { ID, ISODateString } from '@/types/common'

export type KpiCategory = 'tiempo' | 'costo' | 'calidad' | 'productividad'

export type RiskProbability = 'baja' | 'media' | 'alta'

export type RiskImpact = 'bajo' | 'medio' | 'alto'

export type RiskLevel = 'verde' | 'amarillo' | 'rojo'

export type ChangeRequestStatus = 'abierta' | 'en_revision' | 'aprobada' | 'rechazada'

export interface ProjectMetric {
  id: ID
  category: KpiCategory
  name: string
  planned: number
  actual: number
  unit: string
  status: RiskLevel
}

export interface Risk {
  id: ID
  title: string
  description: string
  probability: RiskProbability
  impact: RiskImpact
  level: RiskLevel
  mitigation: string
  owner: string
  open: boolean
  identifiedAt: ISODateString
}

export interface ChangeRequest {
  id: ID
  title: string
  description: string
  status: ChangeRequestStatus
  requestedBy: string
  createdAt: ISODateString
  priority: RiskLevel
}

export interface ProjectKpi {
  label: string
  value: number | string
  unit?: string
  status?: RiskLevel
}
