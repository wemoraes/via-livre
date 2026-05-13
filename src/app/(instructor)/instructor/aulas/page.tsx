import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Calendar, ChevronRight } from "lucide-react";
import { LessonStatus } from "@prisma/client";
import InstructorConfirmButton from "./InstructorConfirmButton";

const STATUS_LABEL: Record<LessonStatus, string> = {
  PENDING: "Aguardando pagamento",
  CONFIRMED: "Confirmada",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
  DISPUTED: "Em disputa",
};

const STATUS_COLOR: Record<LessonStatus, string> = {
  PENDING: "text-yellow-700 bg-yellow-50",
  CONFIRMED: "text-green-700 bg-green-50",
  COMPLETED: "text-blue-700 bg-blue-50",
  CANCELLED: "text-red-700 bg-red-50",
  DISPUTED: "text-orange-700 bg-orange-50",
};

export default async function InstructorAulasPage() {
  const session = await auth();
  if (!session?.user) redirect("/entrar");

  const profile = await prisma.instructorProfile.findUnique({ where: { userId: session.user.id } });
  if (!profile) redirect("/instructor/onboarding");

  const lessons = await prisma.lesson.findMany({
    where: { instructorId: profile.id },
    include: {
      student: { include: { user: { select: { name: true } } } },
    },
    orderBy: { scheduledAt: "desc" },
    take: 50,
  });

  const upcoming = lessons.filter(
    (l) => l.status === LessonStatus.CONFIRMED && l.scheduledAt > new Date(),
  );
  const past = lessons.filter(
    (l) => l.status !== LessonStatus.CONFIRMED || l.scheduledAt <= new Date(),
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Minhas aulas</h1>

        {lessons.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Calendar size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">Nenhuma aula agendada ainda.</p>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <section className="mb-8">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Próximas aulas
                </h2>
                <ul className="space-y-3">
                  {upcoming.map((lesson) => (
                    <li key={lesson.id} className="bg-white border border-gray-100 rounded-2xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate">
                            {lesson.student.user.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Intl.DateTimeFormat("pt-BR", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }).format(lesson.scheduledAt)}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{lesson.meetingPoint}</p>
                        </div>
                        {!lesson.instructorConfirmed && (
                          <InstructorConfirmButton lessonId={lesson.id} />
                        )}
                        {lesson.instructorConfirmed && (
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full shrink-0">
                            Confirmada por você
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Histórico
              </h2>
              <ul className="space-y-3">
                {past.map((lesson) => (
                  <li key={lesson.id} className="bg-white border border-gray-100 rounded-2xl p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {lesson.student.user.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Intl.DateTimeFormat("pt-BR", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(lesson.scheduledAt)}
                        </p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${STATUS_COLOR[lesson.status]}`}>
                        {STATUS_LABEL[lesson.status]}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
