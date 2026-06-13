export type ID = string

export type ISODateString = string

export type Currency = 'CRC' | 'USD'

export type EntityStatus = 'activo' | 'inactivo' | 'graduado'

export type StatusVariant = 'default' | 'success' | 'warning' | 'danger'

export interface NamedEntity {
  id: ID
}
