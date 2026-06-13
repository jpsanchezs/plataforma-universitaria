import type { ChangeRequest, Risk } from '@/types/project'

export const mockRisks: Risk[] = [
  { id: 'rsk-001', title: 'Retraso en integración de módulos', description: 'Dependencias entre portales pueden retrasar entregas.', probability: 'media', impact: 'alto', level: 'rojo', mitigation: 'Planificar integración incremental por sprint.', owner: 'Diego Herrera', open: true, identifiedAt: '2026-01-10' },
  { id: 'rsk-002', title: 'Alcance no congelado', description: 'Solicitudes de cambio frecuentes afectan el cronograma.', probability: 'alta', impact: 'medio', level: 'amarillo', mitigation: 'Comité de control de cambios semanal.', owner: 'Patricia Morales', open: true, identifiedAt: '2026-01-15' },
  { id: 'rsk-003', title: 'Disponibilidad del equipo', description: 'Recursos compartidos con otras iniciativas.', probability: 'media', impact: 'medio', level: 'amarillo', mitigation: 'Reservar capacidad mínima del 70%.', owner: 'Diego Herrera', open: true, identifiedAt: '2026-01-20' },
  { id: 'rsk-004', title: 'Deuda técnica en prototipo', description: 'Atajos en fases iniciales pueden afectar calidad.', probability: 'media', impact: 'medio', level: 'amarillo', mitigation: 'Refactor planificado en fase de pulido.', owner: 'Carlos Méndez', open: true, identifiedAt: '2026-02-01' },
  { id: 'rsk-005', title: 'Validación con stakeholders', description: 'Feedback tardío de usuarios clave.', probability: 'baja', impact: 'alto', level: 'amarillo', mitigation: 'Demos quincenales con actores clave.', owner: 'Ana Lucía Vargas', open: true, identifiedAt: '2026-02-05' },
  { id: 'rsk-006', title: 'Rendimiento en dispositivos móviles', description: 'Experiencia subóptima en pantallas pequeñas.', probability: 'baja', impact: 'bajo', level: 'verde', mitigation: 'Pruebas responsive en fase 10.', owner: 'Laura Chaves', open: true, identifiedAt: '2026-02-08' },
  { id: 'rsk-007', title: 'Migración a backend real', description: 'Complejidad futura al conectar APIs reales.', probability: 'media', impact: 'alto', level: 'rojo', mitigation: 'Diseñar capa de servicios desacoplada.', owner: 'Diego Herrera', open: true, identifiedAt: '2026-01-25' },
  { id: 'rsk-008', title: 'Capacitación de usuarios finales', description: 'Resistencia al cambio en procesos manuales.', probability: 'baja', impact: 'medio', level: 'verde', mitigation: 'Manuales y sesiones de capacitación.', owner: 'Roberto Jiménez', open: false, identifiedAt: '2025-12-10' },
  { id: 'rsk-009', title: 'Seguridad de datos simulados', description: 'Malas prácticas al pasar a producción.', probability: 'baja', impact: 'alto', level: 'amarillo', mitigation: 'Checklist de seguridad pre-producción.', owner: 'Sofía Ramírez', open: true, identifiedAt: '2026-02-10' },
  { id: 'rsk-010', title: 'Indisponibilidad de infraestructura', description: 'Entorno de despliegue no disponible a tiempo.', probability: 'baja', impact: 'medio', level: 'verde', mitigation: 'Ambiente de staging desde fase 8.', owner: 'Diego Herrera', open: false, identifiedAt: '2025-11-20' },
]

export const mockChangeRequests: ChangeRequest[] = [
  { id: 'cr-001', title: 'Ampliar portal financiero', description: 'Incluir reportes de morosidad por carrera.', status: 'abierta', requestedBy: 'Roberto Jiménez', createdAt: '2026-02-01', priority: 'amarillo' },
  { id: 'cr-002', title: 'Dashboard ejecutivo con gráficas', description: 'Agregar visualizaciones interactivas.', status: 'en_revision', requestedBy: 'Patricia Morales', createdAt: '2026-02-05', priority: 'verde' },
  { id: 'cr-003', title: 'Exportación de calificaciones', description: 'Permitir descarga PDF para docentes.', status: 'abierta', requestedBy: 'Carlos Méndez', createdAt: '2026-02-08', priority: 'rojo' },
  { id: 'cr-004', title: 'Notificaciones por correo', description: 'Alertas de pagos pendientes.', status: 'en_revision', requestedBy: 'Ana Lucía Vargas', createdAt: '2026-02-11', priority: 'amarillo' },
]
