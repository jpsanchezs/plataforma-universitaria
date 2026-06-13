# Plataforma Universitaria — Frontend (UTLM)

Prototipo web navegable para la **Universidad Tecnológica La Mejor (UTLM)**. Centraliza portales académicos, administrativos, financieros y ejecutivos con **datos simulados en el cliente** (sin backend real).

## Stack

| Tecnología | Uso |
|------------|-----|
| React 19 | Interfaz |
| TypeScript | Tipado estricto |
| Vite 8 | Build y dev server |
| Tailwind CSS 4 | Estilos |
| React Router 7 | Rutas y guards |
| Recharts | Gráficas en dashboards ejecutivos |

## Requisitos

- Node.js 20+
- npm

## Comandos

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
npm run build    # Compilación de producción
npm run lint     # ESLint
npm run preview  # Vista previa del build
```

## Usuarios demo

Contraseña para todos: **`demo123`**

| Correo | Rol | Módulo principal |
|--------|-----|------------------|
| estudiante@utlm.demo | Estudiante | Perfil, matrícula, calificaciones, cuenta |
| docente@utlm.demo | Docente | Cursos, asistencia, calificaciones |
| admin@utlm.demo | Administrativo | Estudiantes, docentes, cursos, períodos |
| finanzas@utlm.demo | Financiero | Pagos de matrícula, cursos, historial, estado |
| ejecutivo@utlm.demo | Ejecutivo académico | Dashboard académico institucional |
| proyecto@utlm.demo | Director de proyecto | Dashboard ejecutivo del proyecto |

## Qué probar por rol

- **Estudiante:** matricular/retirar cursos, ver horario, calificaciones, estado de cuenta.
- **Docente:** registrar asistencia y notas (persisten en localStorage).
- **Administrativo:** CRUD simulado de entidades (alcance limitado; ver limitaciones).
- **Financiero:** marcar pagos, generar comprobantes simulados.
- **Ejecutivo:** indicadores académicos y financieros con gráficas.
- **Director de proyecto:** KPIs, riesgos, solicitudes de cambio del proyecto UTLM.

## Persistencia local (localStorage)

| Clave | Contenido |
|-------|-----------|
| `utlm_session` | Sesión demo (sin contraseña) |
| `utlm_student_enrollments` | Overrides de matrícula |
| `utlm_teacher_attendance` | Overrides de asistencia |
| `utlm_teacher_grades` | Overrides de calificaciones |
| `utlm_admin_students` | Overrides administrativos — estudiantes |
| `utlm_admin_teachers` | Overrides administrativos — docentes |
| `utlm_admin_courses` | Overrides administrativos — cursos |
| `utlm_admin_periods` | Overrides administrativos — períodos |
| `utlm_finance_payments` | Overrides de pagos y comprobantes |

Las claves están centralizadas en `src/utils/storageKeys.ts`.

## Restablecer datos demo

En cualquier pantalla autenticada, use el botón **Datos demo** en el encabezado:

1. Confirme en el modal.
2. Opcionalmente mantenga o cierre la sesión.
3. Se eliminan overrides del prototipo; los mocks base no cambian.

Útil antes de una exposición en vivo.

## Integraciones entre portales

| Acción | Se refleja en |
|--------|----------------|
| Docente edita nota | Calificaciones del estudiante, dashboard estudiante |
| Finanzas marca pago | Estado de cuenta estudiante, dashboard financiero/ejecutivo |
| Estudiante matricula/retira curso | Horario y resumen del estudiante |

## Limitaciones conocidas

- **Sin backend** ni base de datos real.
- **Sin pasarela de pago** ni datos de tarjeta.
- Persistencia solo en el navegador actual.
- El CRUD administrativo **no sincroniza globalmente** cursos nuevos con matrícula, horarios del docente ni cupos en otros portales (avisos en UI).
- El dashboard docente muestra conteos base de asistencia/notas pendientes desde mocks (no recalcula overrides).
- Build puede advertir chunk >500 kB por Recharts (no bloqueante).

## Estructura

```
src/
├── app/           # Router
├── components/    # UI, layout, demo
├── features/      # Módulos por dominio
├── data/          # Mocks y selectors
├── hooks/         # useLocalStorage, etc.
├── types/         # Modelos TypeScript
└── utils/         # Rutas, permisos, formatters, storageKeys
```

## Guía de demostración

Ver [DEMO_GUIDE.md](./DEMO_GUIDE.md) para un guion paso a paso.
