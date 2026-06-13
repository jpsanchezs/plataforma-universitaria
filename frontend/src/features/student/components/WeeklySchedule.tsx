import type { ScheduleBlock } from '@/types/academic'
import { getCourseById, getTeacherNameById, WEEK_DAYS } from '@/data/selectors'

export interface EnrichedScheduleBlock extends ScheduleBlock {
  courseName: string
  courseCode: string
  teacherName: string
}

interface WeeklyScheduleProps {
  blocks: ScheduleBlock[]
}

function enrichBlock(block: ScheduleBlock): EnrichedScheduleBlock {
  const course = getCourseById(block.courseId)
  return {
    ...block,
    courseName: course?.name ?? 'Curso',
    courseCode: course?.code ?? '—',
    teacherName: course ? getTeacherNameById(course.teacherId) : '—',
  }
}

export function WeeklySchedule({ blocks }: WeeklyScheduleProps) {
  const enriched = blocks.map(enrichBlock)

  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {WEEK_DAYS.map((day) => {
        const dayBlocks = enriched
          .filter((block) => block.day === day)
          .sort((a, b) => a.startTime.localeCompare(b.startTime))

        return (
          <section
            key={day}
            className="rounded-xl border border-primary/10 bg-card p-4 shadow-sm"
          >
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
              {day}
            </h3>
            {dayBlocks.length === 0 ? (
              <p className="text-sm text-muted">Sin clases programadas.</p>
            ) : (
              <div className="space-y-3">
                {dayBlocks.map((block) => (
                  <article
                    key={block.id}
                    className="rounded-lg border border-primary/10 bg-surface px-3 py-3"
                  >
                    <p className="text-xs font-semibold text-accent">{block.courseCode}</p>
                    <p className="text-sm font-medium text-text">{block.courseName}</p>
                    <p className="mt-1 text-xs text-muted">
                      {block.startTime} – {block.endTime} · {block.room}
                    </p>
                    <p className="mt-1 text-xs text-muted">{block.teacherName}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
