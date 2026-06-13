import type { IconType } from 'react-icons'
import {
  FiBarChart2,
  FiBook,
  FiBookOpen,
  FiCalendar,
  FiClipboard,
  FiClock,
  FiCreditCard,
  FiDollarSign,
  FiFileText,
  FiGrid,
  FiHome,
  FiLayers,
  FiTrendingUp,
  FiUser,
  FiUsers,
} from 'react-icons/fi'
import type { Role } from '@/types/auth'
import { ROUTES } from '@/utils/routes'

export { SESSION_STORAGE_KEY } from '@/utils/storageKeys'

export const ROLE_LABELS: Record<Role, string> = {
  estudiante: 'Estudiante',
  docente: 'Docente',
  administrativo: 'Administrativo',
  financiero: 'Financiero',
  ejecutivo: 'Ejecutivo académico',
  'director-proyecto': 'Director de proyecto',
}

export interface NavItemConfig {
  label: string
  path: string
  icon: IconType
}

const ROUTE_ROLE_MAP: Record<string, Role[]> = {
  [ROUTES.DASHBOARD]: [
    'estudiante',
    'docente',
    'administrativo',
    'financiero',
    'ejecutivo',
    'director-proyecto',
  ],
  [ROUTES.STUDENT.PROFILE]: ['estudiante'],
  [ROUTES.STUDENT.ENROLLMENT]: ['estudiante'],
  [ROUTES.STUDENT.SCHEDULE]: ['estudiante'],
  [ROUTES.STUDENT.GRADES]: ['estudiante'],
  [ROUTES.STUDENT.ACCOUNT]: ['estudiante'],
  [ROUTES.STUDENT.HISTORY]: ['estudiante'],
  [ROUTES.TEACHER.COURSES]: ['docente'],
  [ROUTES.TEACHER.ATTENDANCE]: ['docente'],
  [ROUTES.TEACHER.GRADES]: ['docente'],
  [ROUTES.ADMIN.STUDENTS]: ['administrativo'],
  [ROUTES.ADMIN.TEACHERS]: ['administrativo'],
  [ROUTES.ADMIN.COURSES]: ['administrativo'],
  [ROUTES.ADMIN.PERIODS]: ['administrativo'],
  [ROUTES.FINANCE.TUITION]: ['financiero'],
  [ROUTES.FINANCE.COURSES]: ['financiero'],
  [ROUTES.FINANCE.HISTORY]: ['financiero'],
  [ROUTES.FINANCE.STATUS]: ['financiero'],
  [ROUTES.EXECUTIVE.ACADEMIC]: ['ejecutivo'],
  [ROUTES.EXECUTIVE.PROJECT]: ['director-proyecto'],
}

const NAV_BY_ROLE: Record<Role, NavItemConfig[]> = {
  estudiante: [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: FiHome },
    { label: 'Mi perfil', path: ROUTES.STUDENT.PROFILE, icon: FiUser },
    { label: 'Matrícula', path: ROUTES.STUDENT.ENROLLMENT, icon: FiBookOpen },
    { label: 'Horarios', path: ROUTES.STUDENT.SCHEDULE, icon: FiClock },
    { label: 'Calificaciones', path: ROUTES.STUDENT.GRADES, icon: FiFileText },
    { label: 'Estado de cuenta', path: ROUTES.STUDENT.ACCOUNT, icon: FiCreditCard },
    { label: 'Historial académico', path: ROUTES.STUDENT.HISTORY, icon: FiLayers },
  ],
  docente: [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: FiHome },
    { label: 'Mis cursos', path: ROUTES.TEACHER.COURSES, icon: FiBook },
    { label: 'Asistencia', path: ROUTES.TEACHER.ATTENDANCE, icon: FiClipboard },
    { label: 'Calificaciones', path: ROUTES.TEACHER.GRADES, icon: FiFileText },
  ],
  administrativo: [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: FiHome },
    { label: 'Estudiantes', path: ROUTES.ADMIN.STUDENTS, icon: FiUsers },
    { label: 'Docentes', path: ROUTES.ADMIN.TEACHERS, icon: FiUser },
    { label: 'Cursos', path: ROUTES.ADMIN.COURSES, icon: FiBookOpen },
    { label: 'Períodos académicos', path: ROUTES.ADMIN.PERIODS, icon: FiCalendar },
  ],
  financiero: [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: FiHome },
    { label: 'Pagos de matrícula', path: ROUTES.FINANCE.TUITION, icon: FiDollarSign },
    { label: 'Pagos de cursos', path: ROUTES.FINANCE.COURSES, icon: FiCreditCard },
    { label: 'Historial de pagos', path: ROUTES.FINANCE.HISTORY, icon: FiFileText },
    { label: 'Estado financiero', path: ROUTES.FINANCE.STATUS, icon: FiTrendingUp },
  ],
  ejecutivo: [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: FiHome },
    {
      label: 'Dashboard académico',
      path: ROUTES.EXECUTIVE.ACADEMIC,
      icon: FiBarChart2,
    },
  ],
  'director-proyecto': [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: FiHome },
    {
      label: 'Control de proyecto',
      path: ROUTES.EXECUTIVE.PROJECT,
      icon: FiGrid,
    },
  ],
}

export function canAccessRoute(role: Role, path: string): boolean {
  const allowedRoles = ROUTE_ROLE_MAP[path]
  if (!allowedRoles) {
    return false
  }
  return allowedRoles.includes(role)
}

export function getNavItemsForRole(role: Role): NavItemConfig[] {
  return NAV_BY_ROLE[role]
}

export function toSessionUser(user: {
  id: string
  fullName: string
  email: string
  role: Role
  avatarInitials: string
  defaultPath: string
}) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    avatarInitials: user.avatarInitials,
    defaultPath: user.defaultPath,
  }
}
