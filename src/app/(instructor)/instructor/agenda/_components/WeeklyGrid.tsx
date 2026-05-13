"use client";

import { useState, useCallback, useMemo } from "react";
import { LessonStatus } from "@prisma/client";
import { addDays, isSameDay, WEEKDAY_LABELS } from "@/lib/week";
import type { WeekLesson, WeekAvailabilitySlot } from "../_data/week";
import LessonDetailPanel from "./LessonDetailPanel";

const HOUR_START = 6;
const HOUR_END = 22;
const HOURS = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);
const SLOT_HEIGHT_PX = 44;

const STATUS_STYLES: Record<LessonStatus, { bg: string; border: string; text: string }> = {
  CONFIRMED: { bg: "oklch(92% 0.07 145)", border: "oklch(55% 0.17 145)", text: "oklch(35% 0.12 145)" },
  PENDING:   { bg: "oklch(96% 0.04 85)",  border: "oklch(55% 0.12 85)",  text: "oklch(35% 0.10 85)" },
  COMPLETED: { bg: "oklch(93% 0.04 235)", border: "oklch(45% 0.12 235)", text: "oklch(30% 0.10 235)" },
  CANCELLED: { bg: "oklch(95% 0.04 25)",  border: "oklch(50% 0.15 25)",  text: "oklch(35% 0.10 25)" },
  DISPUTED:  { bg: "oklch(95% 0.04 50)",  border: "oklch(52% 0.14 50)",  text: "oklch(35% 0.10 50)" },
};

interface Props {
  weekStart: Date;
  todayWeekStart: Date;
  lessons: WeekLesson[];
  availability: WeekAvailabilitySlot[];
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function isInAvailability(dayOfWeek: number, hour: number, slots: WeekAvailabilitySlot[]): boolean {
  const target = hour * 60;
  return slots.some(
    (s) =>
      s.dayOfWeek === dayOfWeek &&
      timeToMinutes(s.startTime) <= target &&
      timeToMinutes(s.endTime) > target,
  );
}

export default function WeeklyGrid({ weekStart, todayWeekStart, lessons, availability }: Props) {
  const [selectedLesson, setSelectedLesson] = useState<WeekLesson | null>(null);

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const today = useMemo(() => new Date(), []);
  const isCurrentWeek = weekStart.getTime() === todayWeekStart.getTime();

  const handleClick = useCallback((lesson: WeekLesson) => {
    setSelectedLesson(lesson);
  }, []);

  return (
    <>
      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Header com dias */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b" style={{ borderColor: "rgba(13,18,16,0.06)" }}>
          <div className="px-2 py-2 text-[10px] uppercase font-semibold" style={{ color: "var(--vl-text-3)" }}>
            Hora
          </div>
          {days.map((d, i) => {
            const isToday = isCurrentWeek && isSameDay(d, today);
            return (
              <div
                key={i}
                className="px-2 py-2 text-center"
                style={{
                  background: isToday ? "oklch(92% 0.07 145 / 0.5)" : "transparent",
                  borderLeft: i === 0 ? "1px solid rgba(13,18,16,0.06)" : undefined,
                }}
              >
                <p className="text-[10px] uppercase font-semibold leading-none" style={{ color: isToday ? "var(--vl-accent)" : "var(--vl-text-3)" }}>
                  {WEEKDAY_LABELS[i]}
                </p>
                <p className="text-base font-bold mt-0.5" style={{ color: isToday ? "var(--vl-accent)" : "var(--vl-text-1)" }}>
                  {d.getDate()}
                </p>
              </div>
            );
          })}
        </div>

        {/* Grid de horas */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] relative">
          {HOURS.map((h) => (
            <div
              key={h}
              className="px-2 text-[10px] font-medium border-t flex items-start pt-1"
              style={{
                color: "var(--vl-text-3)",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                height: SLOT_HEIGHT_PX,
                borderColor: "rgba(13,18,16,0.04)",
              }}
            >
              {String(h).padStart(2, "0")}:00
            </div>
          )).concat(
            // Slots por dia
            days.flatMap((d, dayIdx) =>
              HOURS.map((h) => {
                const inAvail = isInAvailability(d.getDay(), h, availability);
                const isToday = isCurrentWeek && isSameDay(d, today);
                return (
                  <div
                    key={`${dayIdx}-${h}`}
                    className="border-t"
                    style={{
                      gridColumn: dayIdx + 2,
                      gridRow: h - HOUR_START + 1,
                      height: SLOT_HEIGHT_PX,
                      background: !inAvail
                        ? "rgba(13,18,16,0.03)"
                        : isToday
                        ? "oklch(92% 0.07 145 / 0.08)"
                        : "transparent",
                      borderColor: "rgba(13,18,16,0.04)",
                      borderLeft: dayIdx === 0 ? "1px solid rgba(13,18,16,0.06)" : undefined,
                    }}
                  />
                );
              }),
            ),
          )}

          {/* Lesson blocks (positioned absolutely over the grid) */}
          {lessons.map((lesson) => {
            const d = new Date(lesson.scheduledAt);
            const dayIdx = d.getDay();
            const hour = d.getHours() + d.getMinutes() / 60;
            const top = (hour - HOUR_START) * SLOT_HEIGHT_PX;
            const height = (lesson.durationMin / 60) * SLOT_HEIGHT_PX;

            if (hour < HOUR_START || hour >= HOUR_END) return null;

            const style = STATUS_STYLES[lesson.status];

            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => handleClick(lesson)}
                className="absolute rounded-lg px-1.5 py-1 text-left transition-all hover:shadow-md"
                style={{
                  top,
                  height: Math.max(height - 2, 28),
                  left: `calc(60px + ${(dayIdx / 7) * 100}% - ${(dayIdx / 7) * 60}px + 2px)`,
                  width: `calc(${100 / 7}% - ${60 / 7}px - 4px)`,
                  background: style.bg,
                  border: `1px solid ${style.border}`,
                  color: style.text,
                  fontSize: 10,
                  lineHeight: 1.15,
                  cursor: "pointer",
                }}
              >
                <p className="font-semibold truncate">{lesson.studentName}</p>
                <p className="text-[9px] opacity-75 truncate">
                  {String(d.getHours()).padStart(2, "0")}:{String(d.getMinutes()).padStart(2, "0")}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {selectedLesson && (
        <LessonDetailPanel lesson={selectedLesson} onClose={() => setSelectedLesson(null)} />
      )}
    </>
  );
}
