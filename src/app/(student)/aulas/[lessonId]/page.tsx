import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ArrowLeft, Calendar, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { LessonStatus } from "@prisma/client";
import ConfirmLessonButton from "./ConfirmLessonButton";
import CancelLessonButton from "./CancelLessonButton";
import RatingForm from "./RatingForm";
import ExamResultForm from "./ExamResultForm";

interface Props {
  params: Promise<{ lessonId: string }>;
  searchParams: Promise<{ booked?: string }>;
}

const STATUS_LABEL: Record<LessonStatus, string> = {
  PENDING: "Aguardando pagamento",
  CONFIRMED: "Confirmada",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
  DISPUTED: "Em disputa",
};

export default async function LessonDetailPage({ params, searchParams }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/entrar");

  const { lessonId } = await params;
  const { booked } = await searchParams;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      student: { include: { user: { select: { name: true } } } },
      instructor: { include: { user: { select: { name: true } } } },
      vehicle: { select: { brand: true, model: true, plate: true } },
      rating: { select: { id: true } },
    },
  });

  if (!lesson) notFound();

  const isStudent = lesson.student.userId === session.user.id;
  if (!isStudent) redirect("/entrar");

  const canConfirm = lesson.status === LessonStatus.CONFIRMED && !lesson.studentConfirmed;
  const canCancel = lesson.status === LessonStatus.PENDING || lesson.status === LessonStatus.CONFIRMED;
  const isCompleted = lesson.status === LessonStatus.COMPLETED;
  const alreadyRated = Boolean(lesson.rating);
  const alreadyExamResult = lesson.examResult !== null;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-10">
        <Link
          href="/aulas"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-8"
        >
          <ArrowLeft size={14} />
          Minhas aulas
        </Link>

        {booked && (
          <div className="mb-6 flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-green-800 font-medium">Aula agendada com sucesso!</p>
              <p className="text-xs text-green-700 mt-0.5">
                Você receberá um e-mail de confirmação em breve.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-lg font-semibold text-gray-900">Detalhes da aula</h1>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              lesson.status === LessonStatus.CONFIRMED ? "bg-green-50 text-green-700"
              : lesson.status === LessonStatus.COMPLETED ? "bg-blue-50 text-blue-700"
              : lesson.status === LessonStatus.CANCELLED ? "bg-red-50 text-red-700"
              : "bg-yellow-50 text-yellow-700"
            }`}>
              {STATUS_LABEL[lesson.status]}
            </span>
          </div>

          <dl className="space-y-4 text-sm">
            <div className="flex gap-3">
              <Calendar size={16} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <dt className="text-gray-500 text-xs">Data e hora</dt>
                <dd className="font-medium text-gray-900 mt-0.5">
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "full",
                    timeStyle: "short",
                  }).format(lesson.scheduledAt)}
                </dd>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock size={16} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <dt className="text-gray-500 text-xs">Duração</dt>
                <dd className="font-medium text-gray-900 mt-0.5">{lesson.durationMin} minutos</dd>
              </div>
            </div>

            <div className="flex gap-3">
              <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <dt className="text-gray-500 text-xs">Ponto de encontro</dt>
                <dd className="font-medium text-gray-900 mt-0.5">{lesson.meetingPoint}</dd>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <dt className="text-gray-500 text-xs mb-1">Instrutor</dt>
              <dd className="font-medium text-gray-900">{lesson.instructor.user.name}</dd>
            </div>

            <div>
              <dt className="text-gray-500 text-xs mb-1">Veículo</dt>
              <dd className="font-medium text-gray-900">
                {lesson.vehicle.brand} {lesson.vehicle.model} · {lesson.vehicle.plate}
              </dd>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <dt className="text-gray-500 text-xs mb-1">Valor</dt>
              <dd className="text-lg font-bold text-[oklch(55%_0.17_145)]">
                R$ {Number(lesson.priceAmount).toFixed(2)}
              </dd>
            </div>
          </dl>

          {(canConfirm || canCancel) && (
            <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
              {canConfirm && <ConfirmLessonButton lessonId={lesson.id} />}
              {canCancel && <CancelLessonButton lessonId={lesson.id} />}
            </div>
          )}

          {isCompleted && (
            <div className="space-y-6 mt-6 pt-5 border-t border-gray-100">
              {!alreadyRated && <RatingForm lessonId={lesson.id} />}
              {!alreadyExamResult && <ExamResultForm lessonId={lesson.id} />}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
