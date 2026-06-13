import type { ScheduleBlock } from '@/types/academic'

export const mockSchedules: ScheduleBlock[] = [
  { id: 'sch-001', courseId: 'crs-001', day: 'Lunes', startTime: '08:00', endTime: '10:00', room: 'B-204' },
  { id: 'sch-002', courseId: 'crs-001', day: 'Miércoles', startTime: '08:00', endTime: '10:00', room: 'B-204' },
  { id: 'sch-003', courseId: 'crs-002', day: 'Martes', startTime: '10:00', endTime: '12:00', room: 'Lab-102' },
  { id: 'sch-004', courseId: 'crs-002', day: 'Jueves', startTime: '10:00', endTime: '12:00', room: 'Lab-102' },
  { id: 'sch-005', courseId: 'crs-003', day: 'Lunes', startTime: '14:00', endTime: '16:00', room: 'A-301' },
  { id: 'sch-006', courseId: 'crs-004', day: 'Martes', startTime: '14:00', endTime: '16:00', room: 'Lab-201' },
  { id: 'sch-007', courseId: 'crs-004', day: 'Viernes', startTime: '08:00', endTime: '10:00', room: 'Lab-201' },
  { id: 'sch-008', courseId: 'crs-005', day: 'Miércoles', startTime: '10:00', endTime: '12:00', room: 'C-105' },
  { id: 'sch-009', courseId: 'crs-006', day: 'Viernes', startTime: '14:00', endTime: '16:00', room: 'D-110' },
  { id: 'sch-010', courseId: 'crs-007', day: 'Lunes', startTime: '10:00', endTime: '12:00', room: 'B-205' },
  { id: 'sch-011', courseId: 'crs-008', day: 'Miércoles', startTime: '14:00', endTime: '16:00', room: 'Lab-103' },
  { id: 'sch-012', courseId: 'crs-008', day: 'Viernes', startTime: '10:00', endTime: '12:00', room: 'Lab-103' },
  { id: 'sch-013', courseId: 'crs-009', day: 'Martes', startTime: '16:00', endTime: '18:00', room: 'A-302' },
  { id: 'sch-014', courseId: 'crs-010', day: 'Jueves', startTime: '14:00', endTime: '16:00', room: 'C-106' },
  { id: 'sch-015', courseId: 'crs-011', day: 'Lunes', startTime: '16:00', endTime: '18:00', room: 'Lab-202' },
  { id: 'sch-016', courseId: 'crs-012', day: 'Miércoles', startTime: '08:00', endTime: '10:00', room: 'D-111' },
  { id: 'sch-017', courseId: 'crs-003', day: 'Miércoles', startTime: '16:00', endTime: '18:00', room: 'A-301' },
  { id: 'sch-018', courseId: 'crs-005', day: 'Viernes', startTime: '08:00', endTime: '10:00', room: 'C-105' },
  { id: 'sch-019', courseId: 'crs-007', day: 'Jueves', startTime: '08:00', endTime: '10:00', room: 'B-205' },
  { id: 'sch-020', courseId: 'crs-010', day: 'Martes', startTime: '08:00', endTime: '10:00', room: 'C-106' },
]
