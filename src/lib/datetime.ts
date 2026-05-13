const lessonDateTimeFmt = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const compactDateFmt = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatLessonDateTime(date: Date): string {
  return lessonDateTimeFmt.format(date).replace(",", " ·");
}

export function formatCompactDateTime(date: Date): string {
  return compactDateFmt.format(date).replace(",", " ·");
}

export function formatCountdown(target: Date, now: Date = new Date()): string {
  const ms = target.getTime() - now.getTime();
  if (ms < 0) return "Já começou";

  const minutes = Math.floor(ms / 60_000);
  const hours = Math.floor(ms / 3_600_000);
  const days = Math.floor(ms / 86_400_000);

  if (minutes < 60) return minutes <= 1 ? "Agora" : `Em ${minutes} min`;
  if (hours < 24) return `Em ${hours}h`;
  if (days === 0) return "Hoje";
  if (days === 1) return "Amanhã";
  if (days < 7) return `Em ${days} dias`;
  if (days < 30) return `Em ${Math.floor(days / 7)} sem.`;
  return `Em ${Math.floor(days / 30)} mês${days >= 60 ? "es" : ""}`;
}
