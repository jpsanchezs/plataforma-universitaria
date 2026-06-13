import type { User } from '@/types/auth'
import { ROUTES } from '@/utils/routes'

export const mockUsers: User[] = [
  {
    id: 'user-student-001',
    fullName: 'María Fernández Solís',
    email: 'estudiante@utlm.demo',
    password: 'demo123',
    role: 'estudiante',
    avatarInitials: 'MF',
    defaultPath: ROUTES.STUDENT.PROFILE,
  },
  {
    id: 'user-teacher-001',
    fullName: 'Carlos Méndez Rojas',
    email: 'docente@utlm.demo',
    password: 'demo123',
    role: 'docente',
    avatarInitials: 'CM',
    defaultPath: ROUTES.TEACHER.COURSES,
  },
  {
    id: 'user-admin-001',
    fullName: 'Ana Lucía Vargas',
    email: 'admin@utlm.demo',
    password: 'demo123',
    role: 'administrativo',
    avatarInitials: 'AV',
    defaultPath: ROUTES.ADMIN.STUDENTS,
  },
  {
    id: 'user-finance-001',
    fullName: 'Roberto Jiménez Castro',
    email: 'finanzas@utlm.demo',
    password: 'demo123',
    role: 'financiero',
    avatarInitials: 'RJ',
    defaultPath: ROUTES.FINANCE.TUITION,
  },
  {
    id: 'user-executive-001',
    fullName: 'Patricia Morales Vega',
    email: 'ejecutivo@utlm.demo',
    password: 'demo123',
    role: 'ejecutivo',
    avatarInitials: 'PM',
    defaultPath: ROUTES.EXECUTIVE.ACADEMIC,
  },
  {
    id: 'user-pm-001',
    fullName: 'Diego Herrera Quesada',
    email: 'proyecto@utlm.demo',
    password: 'demo123',
    role: 'director-proyecto',
    avatarInitials: 'DH',
    defaultPath: ROUTES.EXECUTIVE.PROJECT,
  },
]

export function findUserByCredentials(
  email: string,
  password: string,
): User | undefined {
  return mockUsers.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase().trim() &&
      user.password === password,
  )
}
