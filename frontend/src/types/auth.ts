export type Role =
  | 'estudiante'
  | 'docente'
  | 'administrativo'
  | 'financiero'
  | 'ejecutivo'
  | 'director-proyecto'

export interface User {
  id: string
  fullName: string
  email: string
  password: string
  role: Role
  avatarInitials: string
  defaultPath: string
}

export interface SessionUser {
  id: string
  fullName: string
  email: string
  role: Role
  avatarInitials: string
  defaultPath: string
}
