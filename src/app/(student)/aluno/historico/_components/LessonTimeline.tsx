import Link from "next/link";
import { ChevronRight, Pencil } from "lucide-react";
import { LessonStatus } from "@prisma/client";
import { formatLessonDateTime } from "@/lib/datetime";
import { LESSON_STATUS_LABEL, LESSON_STATUS_STYLE } from "@/lib/status-colors";
import StarRating from "@/components/ui/StarRating";
import type { HistoryLessonItem } from "../_data/history";

interface Props {
  items: HistoryLessonItem[];
}

export default function LessonTimeline({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <ol className="space-y-3">
      {items.map((lesson) => {
        const isPendingRating = lesson.status === LessonStatus.COMPLETED && lesson.ratingGiven === null;
        const hasAnyRating = lesson.ratingGiven !== null || lesson.ratingReceived !== null;
        return (
          <li
            key={lesson.id}
            data-pending-rating={isPendingRating ? "true" : undefined}
          >
            <Link
              href={isPendingRating ? `/aulas/${lesson.id}#avaliar` : `/aulas/${lesson.id}`}
              className="glass-card rounded-2xl block p-4 hover:shadow-lg transition-all"
              style={{
                textDecoration: "none",
                ...(isPendingRating
                  ? { boxShadow: "0 0 0 2px oklch(55% 0.17 145 / 0.25)" }
                  : {}),
              }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate" style={{ color: "var(--vl-text-1)" }}>
                    {lesson.instructorName}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--vl-text-3)" }}>
                    {formatLessonDateTime(lesson.scheduledAt)}
                  </p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "var(--vl-text-3)" }}>
                    {lesson.meetingPoint}
                  </p>

                  {hasAnyRating && (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                      {lesson.ratingGiven && (
                        <div className="inline-flex items-center gap-1.5">
                          <span className="text-xs" style={{ color: "var(--vl-text-3)" }}>Você avaliou:</span>
                          <StarRating score={lesson.ratingGiven.score} size={12} />
                        </div>
                      )}
                      {lesson.ratingReceived && (
                        <div className="inline-flex items-center gap-1.5">
                          <span className="text-xs" style={{ color: "var(--vl-text-3)" }}>Você recebeu:</span>
                          <StarRating score={lesson.ratingReceived.score} size={12} />
                        </div>
                      )}
                    </div>
                  )}

                  {isPendingRating && (
                    <span
                      className="inline-flex items-center gap-1 text-xs mt-2 px-2 py-0.5 rounded-full font-medium"
                      style={{ background: "oklch(92% 0.07 145)", color: "var(--vl-accent)" }}
                    >
                      <Pencil size={10} />
                      Avaliar agora
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{
                      color: LESSON_STATUS_STYLE[lesson.status].color,
                      background: LESSON_STATUS_STYLE[lesson.status].bg,
                    }}
                  >
                    {LESSON_STATUS_LABEL[lesson.status]}
                  </span>
                  <ChevronRight size={15} style={{ color: "var(--vl-text-3)" }} />
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
