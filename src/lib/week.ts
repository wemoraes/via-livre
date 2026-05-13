/**
 * Helpers para manipulação de semanas (domingo como primeiro dia, padrão BR).
 */

const DAY_MS = 86_400_000;

export function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

export function startOfWeek(d: Date): Date {
  const dow = d.getDay(); // 0 = domingo
  const result = startOfDay(d);
  result.setDate(result.getDate() - dow);
  return result;
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * DAY_MS);
}

export function addWeeks(d: Date, n: number): Date {
  return addDays(d, n * 7);
}

export function endOfWeek(d: Date): Date {
  const start = startOfWeek(d);
  const end = addDays(start, 7);
  return end;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const isoFmt = "YYYY-MM-DD";

export function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseIsoDate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatWeekRangeShort(weekStart: Date): string {
  const start = weekStart;
  const end = addDays(weekStart, 6);
  const sameMonth = start.getMonth() === end.getMonth();
  const sameYear = start.getFullYear() === end.getFullYear();
  const dayFmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit" });
  const monthFmt = new Intl.DateTimeFormat("pt-BR", { month: "short" });
  const yearFmt = new Intl.DateTimeFormat("pt-BR", { year: "numeric" });

  if (sameMonth) {
    return `${dayFmt.format(start)}–${dayFmt.format(end)} ${monthFmt.format(end).replace(".", "")} ${yearFmt.format(end)}`;
  }
  if (sameYear) {
    return `${dayFmt.format(start)} ${monthFmt.format(start).replace(".", "")} – ${dayFmt.format(end)} ${monthFmt.format(end).replace(".", "")} ${yearFmt.format(end)}`;
  }
  return `${dayFmt.format(start)} ${monthFmt.format(start)} ${yearFmt.format(start)} – ${dayFmt.format(end)} ${monthFmt.format(end)} ${yearFmt.format(end)}`;
}

export const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
