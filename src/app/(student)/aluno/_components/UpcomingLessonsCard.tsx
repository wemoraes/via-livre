import Link from "next/link";
import { ChevronRight, Calendar } from "lucide-react";
import { formatCompactDateTime } from "@/lib/datetime";
import { LESSON_STATUS_LABEL, LESSON_STATUS_STYLE } from "@/lib/status-colors";
import type { UpcomingLessonData } from "../_data/dashboard";

interface Props {
  upcoming: UpcomingLessonData[];
  totalUpcoming: number;
}

export default function UpcomingLessonsCard({ upcoming, totalUpcoming }: Props) {
  if (upcoming.length === 0) return null;

  return (
    <section className="mb-6">
      <header className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--vl-text-3)" }}>
          Outras próximas
        </h3>
        {totalUpcoming > 6 && (
          <Link
            href="/aulas"
            className="text-xs font-medium hover:underline"
            style={{ color: "var(--vl-accent)" }}
          >
            Ver todas
          </Link>
        )}
      </header>

      <ul className="space-y-2">
        {upcoming.map((lesson) => (
          <li key={lesson.id}>
            <Link
              href={`/aulas/${lesson.id}`}
              className="glass-card rounded-2xl flex items-center gap-4 p-4 hover:shadow-lg transition-all"
              style={{ textDecoration: "none" }}
            >
              <Calendar size={16} style={{ color: "var(--vl-text-3)" }} className="shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate" style={{ color: "var(--vl-text-1)" }}>
                  {lesson.instructorName}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--vl-text-3)" }}>
                  {formatCompactDateTime(lesson.scheduledAt)}
                </p>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium shrink-0"
                style={{
                  color: LESSON_STATUS_STYLE[lesson.status].color,
                  background: LESSON_STATUS_STYLE[lesson.status].bg,
                }}
              >
                {LESSON_STATUS_LABEL[lesson.status]}
              </span>
              <ChevronRight size={15} style={{ color: "var(--vl-text-3)" }} className="shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
