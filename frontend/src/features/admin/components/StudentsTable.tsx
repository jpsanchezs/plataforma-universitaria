import type { Student } from '@/types/academic'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { formatGpa } from '@/utils/formatters'

interface StudentsTableProps {
  students: Student[]
  onView: (student: Student) => void
  onEdit: (student: Student) => void
  onChangeStatus: (student: Student) => void
}

export function StudentsTable({ students, onView, onEdit, onChangeStatus }: StudentsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-primary/10 bg-card">
      <table className="min-w-full text-sm">
        <thead className="bg-primary/5">
          <tr>
            {['Carnet', 'Nombre', 'Carrera', 'Semestre', 'Campus', 'GPA', 'Estado', 'Acciones'].map(
              (header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted"
                >
                  {header}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-primary/10">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-primary/5">
              <td className="px-4 py-3 font-medium text-text">{student.carnet}</td>
              <td className="px-4 py-3 text-text">{student.fullName}</td>
              <td className="px-4 py-3 text-text">{student.career}</td>
              <td className="px-4 py-3 text-text">{student.semester}</td>
              <td className="px-4 py-3 text-text">{student.campus}</td>
              <td className="px-4 py-3 text-text">{formatGpa(student.gpa)}</td>
              <td className="px-4 py-3">
                <StatusBadge status={student.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => onView(student)}>
                    Ver
                  </Button>
                  <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => onEdit(student)}>
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    className="px-2 py-1 text-xs"
                    onClick={() => onChangeStatus(student)}
                  >
                    Estado
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
