export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  FORBIDDEN: '/403',
  STUDENT: {
    PROFILE: '/estudiante/perfil',
    ENROLLMENT: '/estudiante/matricula',
    SCHEDULE: '/estudiante/horarios',
    GRADES: '/estudiante/calificaciones',
    ACCOUNT: '/estudiante/cuenta',
    HISTORY: '/estudiante/historial',
  },
  TEACHER: {
    COURSES: '/docente/cursos',
    ATTENDANCE: '/docente/asistencia',
    GRADES: '/docente/calificaciones',
  },
  ADMIN: {
    STUDENTS: '/admin/estudiantes',
    TEACHERS: '/admin/docentes',
    COURSES: '/admin/cursos',
    PERIODS: '/admin/periodos',
  },
  FINANCE: {
    TUITION: '/finanzas/matricula',
    COURSES: '/finanzas/cursos',
    HISTORY: '/finanzas/historial',
    STATUS: '/finanzas/estado',
  },
  EXECUTIVE: {
    ACADEMIC: '/ejecutivo/academico',
    PROJECT: '/ejecutivo/proyecto',
  },
} as const

export const ALL_PROTECTED_PATHS = [
  ROUTES.DASHBOARD,
  ...Object.values(ROUTES.STUDENT),
  ...Object.values(ROUTES.TEACHER),
  ...Object.values(ROUTES.ADMIN),
  ...Object.values(ROUTES.FINANCE),
  ...Object.values(ROUTES.EXECUTIVE),
] as const
