import type { EffectiveGradeRow, GradeField } from '@/features/teacher/types'
import type { Student } from '@/types/academic'
import { GradeStatusBadge } from '@/features/student/components/GradeStatusBadge'
import { Input } from '@/components/ui/Input'
import { formatGrade, formatGradeCell } from '@/utils/formatters'

interface GradebookTableProps {
  students: Student[]
  rows: EffectiveGradeRow[]
  onGradeChange: (studentId: string, field: GradeField, value: string) => void
  getFieldError: (studentId: string, field: GradeField) => string | undefined
}

export function GradebookTable({
  students,
  rows,
  onGradeChange,
  getFieldError,
}: GradebookTableProps) {
  const rowMap = new Map(rows.map((row) => [row.studentId, row]))

  return (
    <div className="overflow-x-auto rounded-xl border border-primary/10 bg-card">
      <table className="min-w-full text-sm">
        <thead className="bg-primary/5">
          <tr>
            {['Carnet', 'Nombre', 'Parcial 1', 'Parcial 2', 'Examen final', 'Nota final', 'Estado'].map(
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
          {students.map((student) => {
            const gradeRow = rowMap.get(student.id)
            if (!gradeRow) {
              return null
            }

            return (
              <tr key={student.id} className="hover:bg-primary/5">
                <td className="px-4 py-3 font-medium text-text">{student.carnet}</td>
                <td className="px-4 py-3 text-text">{student.fullName}</td>
                {(['partial1', 'partial2', 'finalExam'] as GradeField[]).map((field) => (
                  <td key={field} className="px-4 py-3">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      aria-label={`${field} de ${student.fullName}`}
                      value={gradeRow[field] ?? ''}
                      error={getFieldError(student.id, field)}
                      onChange={(event) =>
                        onGradeChange(student.id, field, event.target.value)
                      }
                      className="min-w-24"
                    />
                  </td>
                ))}
                <td className="px-4 py-3 text-center font-medium text-text">
                  {gradeRow.finalGrade !== null
                    ? formatGrade(gradeRow.finalGrade)
                    : formatGradeCell(null)}
                </td>
                <td className="px-4 py-3">
                  <GradeStatusBadge status={gradeRow.status} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
