import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Calendar, ChevronRight, Search } from "lucide-react";
import { LessonStatus } from "@prisma/client";

const STATUS_LABEL: Record<LessonStatus, string> = {
  PENDING: "Aguardando pagamento",
  CONFIRMED: "Confirmada",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
  DISPUTED: "Não compareceu",
};

const STATUS_STYLE: Record<LessonStatus, { color: string; bg: string }> = {
  PENDING:   { color: "oklch(55% 0.12 85)",  bg: "oklch(96% 0.04 85)" },
  CONFIRMED: { color: "var(--vl-accent)",     bg: "oklch(92% 0.07 145)" },
  COMPLETED: { color: "oklch(45% 0.12 235)",  bg: "oklch(93% 0.04 235)" },
  CANCELLED: { color: "oklch(50% 0.15 25)",   bg: "oklch(95% 0.04 25)" },
  DISPUTED:  { color: "oklch(45% 0.08 0)",    bg: "oklch(95% 0.02 0)" },
};

const fmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" });

export default async function AulasPage() {
  const session = await auth();
  if (!session?.user) redirect("/entrar");

  const student = await prisma.studentProfile.findUnique({ where: { userId: session.user.id } });
  if (!student) redirect("/entrar");

  const lessons = await prisma.lesson.findMany({
    where: { studentId: student.id },
    include: { instructor: { include: { user: { select: { name: true } } } } },
    orderBy: { scheduledAt: "desc" },
    take: 50,
  });

  return (
    <main
      className="min-h-screen py-10 px-4"
      style={{ fontFamily: "var(--font-plus-jakarta-sans), system-ui, sans-serif" }}
    >
      <div aria-hidden className="vl-mesh" />

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-8" style={{ color: "var(--vl-text-1)" }}>
          Minhas aulas
        </h1>

        {lessons.length === 0 ? (
          <div className="glass-card rounded-2xl py-16 text-center">
            <Calendar size={40} className="mx-auto mb-4" style={{ color: "var(--vl-text-3)", opacity: 0.5 }} />
            <h2 className="text-base font-medium mb-2" style={{ color: "var(--vl-text-1)" }}>
              Nenhuma aula agendada ainda
            </h2>
            <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: "var(--vl-text-3)" }}>
              Encontre um instrutor credenciado perto de você e agende sua primeira aula.
            </p>
            <Link
              href="/instrutores"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
              style={{ background: "var(--vl-accent)", color: "#fff" }}
            >
              <Search size={15} />
              Buscar instrutores
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {lessons.map((lesson) => (
              <li key={lesson.id}>
                <Link
                  href={`/aulas/${lesson.id}`}
                  className="glass-card rounded-2xl flex items-center gap-4 p-4 hover:shadow-lg transition-all"
                  style={{ textDecoration: "none" }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate" style={{ color: "var(--vl-text-1)" }}>
                      {lesson.instructor.user.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--vl-text-3)" }}>
                      {fmt.format(lesson.scheduledAt)}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium shrink-0"
                    style={{
                      color: STATUS_STYLE[lesson.status].color,
                      background: STATUS_STYLE[lesson.status].bg,
                    }}
                  >
                    {STATUS_LABEL[lesson.status]}
                  </span>
                  <ChevronRight size={15} style={{ color: "var(--vl-text-3)" }} className="shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
