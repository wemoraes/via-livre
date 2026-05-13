import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ArrowLeft, Calendar, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { LessonStatus } from "@prisma/client";
import { LESSON_STATUS_LABEL, LESSON_STATUS_STYLE } from "@/lib/status-colors";
import ConfirmLessonButton from "./ConfirmLessonButton";
import CancelLessonButton from "./CancelLessonButton";
import RatingForm from "./RatingForm";
import ExamResultForm from "./ExamResultForm";

interface Props {
  params: Promise<{ lessonId: string }>;
  searchParams: Promise<{ booked?: string }>;
}

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

  const fmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeStyle: "short" });

  return (
    <div className="max-w-xl">
        <Link
          href="/aulas"
          className="inline-flex items-center gap-1 text-sm mb-8 hover:opacity-70"
          style={{ color: "var(--vl-text-3)" }}
        >
          <ArrowLeft size={14} />
          Minhas aulas
        </Link>

        {booked && (
          <div className="glass-card rounded-2xl mb-6 flex items-start gap-3 px-4 py-3">
            <CheckCircle2 size={18} style={{ color: "var(--vl-accent)" }} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--vl-text-1)" }}>Aula agendada com sucesso!</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--vl-text-3)" }}>
                Você receberá um e-mail de confirmação em breve.
              </p>
            </div>
          </div>
        )}

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-lg font-semibold" style={{ color: "var(--vl-text-1)" }}>Detalhes da aula</h1>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                color: LESSON_STATUS_STYLE[lesson.status].color,
                background: LESSON_STATUS_STYLE[lesson.status].bg,
              }}
            >
              {LESSON_STATUS_LABEL[lesson.status]}
            </span>
          </div>

          <dl className="space-y-4 text-sm">
            <div className="flex gap-3">
              <Calendar size={16} style={{ color: "var(--vl-text-3)" }} className="mt-0.5 shrink-0" />
              <div>
                <dt className="text-xs" style={{ color: "var(--vl-text-3)" }}>Data e hora</dt>
                <dd className="font-medium mt-0.5" style={{ color: "var(--vl-text-1)" }}>
                  {fmt.format(lesson.scheduledAt)}
                </dd>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock size={16} style={{ color: "var(--vl-text-3)" }} className="mt-0.5 shrink-0" />
              <div>
                <dt className="text-xs" style={{ color: "var(--vl-text-3)" }}>Duração</dt>
                <dd className="font-medium mt-0.5" style={{ color: "var(--vl-text-1)" }}>{lesson.durationMin} minutos</dd>
              </div>
            </div>

            <div className="flex gap-3">
              <MapPin size={16} style={{ color: "var(--vl-text-3)" }} className="mt-0.5 shrink-0" />
              <div>
                <dt className="text-xs" style={{ color: "var(--vl-text-3)" }}>Ponto de encontro</dt>
                <dd className="font-medium mt-0.5" style={{ color: "var(--vl-text-1)" }}>{lesson.meetingPoint}</dd>
              </div>
            </div>

            <div className="pt-4" style={{ borderTop: "1px solid rgba(13,18,16,0.08)" }}>
              <dt className="text-xs mb-1" style={{ color: "var(--vl-text-3)" }}>Instrutor</dt>
              <dd className="font-medium" style={{ color: "var(--vl-text-1)" }}>{lesson.instructor.user.name}</dd>
            </div>

            <div>
              <dt className="text-xs mb-1" style={{ color: "var(--vl-text-3)" }}>Veículo</dt>
              <dd className="font-medium" style={{ color: "var(--vl-text-1)" }}>
                {lesson.vehicle.brand} {lesson.vehicle.model} · {lesson.vehicle.plate}
              </dd>
            </div>

            <div className="pt-4" style={{ borderTop: "1px solid rgba(13,18,16,0.08)" }}>
              <dt className="text-xs mb-1" style={{ color: "var(--vl-text-3)" }}>Valor</dt>
              <dd className="text-lg font-bold" style={{ color: "var(--vl-accent)" }}>
                R$ {Number(lesson.priceAmount).toFixed(2)}
              </dd>
            </div>
          </dl>

          {(canConfirm || canCancel) && (
            <div className="flex gap-3 mt-6 pt-5" style={{ borderTop: "1px solid rgba(13,18,16,0.08)" }}>
              {canConfirm && <ConfirmLessonButton lessonId={lesson.id} />}
              {canCancel && <CancelLessonButton lessonId={lesson.id} />}
            </div>
          )}

          {isCompleted && (
            <div className="space-y-6 mt-6 pt-5" style={{ borderTop: "1px solid rgba(13,18,16,0.08)" }}>
              {!alreadyRated && <RatingForm lessonId={lesson.id} />}
              {!alreadyExamResult && <ExamResultForm lessonId={lesson.id} />}
            </div>
          )}
      </div>
    </div>
  );
}
