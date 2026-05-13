import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Calendar, ChevronRight } from "lucide-react";
import { LessonStatus } from "@prisma/client";

const STATUS_LABEL: Record<LessonStatus, string> = {
  PENDING: "Aguardando pagamento",
  CONFIRMED: "Confirmada",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
  DISPUTED: "Não compareceu",
};

const STATUS_COLOR: Record<LessonStatus, string> = {
  PENDING: "text-yellow-700 bg-yellow-50",
  CONFIRMED: "text-green-700 bg-green-50",
  COMPLETED: "text-blue-700 bg-blue-50",
  CANCELLED: "text-red-700 bg-red-50",
  DISPUTED: "text-gray-700 bg-gray-50",
};

export default async function AulasPage() {
  const session = await auth();
  if (!session?.user) redirect("/entrar");

  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!student) redirect("/entrar");

  const lessons = await prisma.lesson.findMany({
    where: { studentId: student.id },
    include: {
      instructor: { include: { user: { select: { name: true } } } },
    },
    orderBy: { scheduledAt: "desc" },
    take: 50,
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Minhas aulas</h1>

        {lessons.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Calendar size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">Você ainda não tem aulas agendadas.</p>
            <Link href="/instrutores" className="mt-4 inline-block text-sm text-[oklch(55%_0.17_145)] hover:underline">
              Buscar instrutores
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {lessons.map((lesson) => (
              <li key={lesson.id}>
                <Link
                  href={`/aulas/${lesson.id}`}
                  className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 hover:border-gray-200 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {lesson.instructor.user.name}
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
                  <ChevronRight size={15} className="text-gray-400 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
