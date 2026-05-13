import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Car, Clock, CheckCircle2 } from "lucide-react";
import { LessonStatus, UserRole } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { LESSON_STATUS_LABEL, LESSON_STATUS_STYLE } from "@/lib/status-colors";
import { formatLessonDateTime } from "@/lib/datetime";
import RatingForm from "@/components/features/ratings/RatingForm";
import StarRating from "@/components/ui/StarRating";
import InstructorConfirmButton from "../InstructorConfirmButton";

interface Props {
  params: Promise<{ lessonId: string }>;
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const INSTRUCTOR_SHARE = 0.85;

export default async function InstructorLessonDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/entrar");

  const { lessonId } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      student: { include: { user: { select: { name: true, email: true } } } },
      instructor: { select: { userId: true } },
      vehicle: { select: { brand: true, model: true, plate: true } },
      ratings: { select: { authorId: true, score: true, comment: true, role: true } },
    },
  });

  if (!lesson) notFound();

  const isInstructor = lesson.instructor.userId === session.user.id;
  if (!isInstructor) redirect("/entrar");

  const isCompleted = lesson.status === LessonStatus.COMPLETED;
  const canConfirm = lesson.status === LessonStatus.CONFIRMED && !lesson.instructorConfirmed;

  const myRating = lesson.ratings.find((r) => r.authorId === session.user.id);
  const ratingReceived = lesson.ratings.find(
    (r) => r.authorId !== session.user.id && r.role === UserRole.STUDENT,
  );
  const alreadyRated = !!myRating;

  const gross = Number(lesson.priceAmount);
  const net = gross * INSTRUCTOR_SHARE;

  return (
    <div className="max-w-xl">
      <Link
        href="/instructor/aulas"
        className="inline-flex items-center gap-1 text-sm mb-6 hover:opacity-70"
        style={{ color: "var(--vl-text-3)" }}
      >
        <ArrowLeft size={14} />
        Minhas aulas
      </Link>

      <div className="glass-card rounded-2xl p-6">
        <header className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold leading-tight" style={{ color: "var(--vl-text-1)" }}>
              {lesson.student.user.name}
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--vl-text-2)" }}>
              {formatLessonDateTime(lesson.scheduledAt)}
            </p>
          </div>
          <span
            className="shrink-0 inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium"
            style={{
              color: LESSON_STATUS_STYLE[lesson.status].color,
              background: LESSON_STATUS_STYLE[lesson.status].bg,
            }}
          >
            {LESSON_STATUS_LABEL[lesson.status]}
          </span>
        </header>

        <dl className="space-y-3 mb-5 text-sm">
          <div className="flex items-start gap-2">
            <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: "var(--vl-text-3)" }} />
            <div>
              <dt className="text-xs" style={{ color: "var(--vl-text-3)" }}>Ponto de encontro</dt>
              <dd style={{ color: "var(--vl-text-2)" }}>{lesson.meetingPoint}</dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Car size={14} className="mt-0.5 shrink-0" style={{ color: "var(--vl-text-3)" }} />
            <div>
              <dt className="text-xs" style={{ color: "var(--vl-text-3)" }}>Veículo</dt>
              <dd style={{ color: "var(--vl-text-2)" }}>
                {lesson.vehicle.brand} {lesson.vehicle.model} · {lesson.vehicle.plate}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock size={14} className="mt-0.5 shrink-0" style={{ color: "var(--vl-text-3)" }} />
            <div>
              <dt className="text-xs" style={{ color: "var(--vl-text-3)" }}>Duração</dt>
              <dd style={{ color: "var(--vl-text-2)" }}>{lesson.durationMin} minutos</dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xs font-bold mt-0.5 shrink-0" style={{ color: "var(--vl-text-3)" }}>R$</span>
            <div>
              <dt className="text-xs" style={{ color: "var(--vl-text-3)" }}>Receita</dt>
              <dd style={{ color: "var(--vl-text-2)", fontFamily: "var(--font-jetbrains-mono), monospace", fontWeight: 600 }}>
                {brl.format(net)} <span className="text-xs font-normal" style={{ color: "var(--vl-text-3)" }}>líquido · bruto {brl.format(gross)}</span>
              </dd>
            </div>
          </div>
        </dl>

        {canConfirm && (
          <div className="pt-4 mb-2" style={{ borderTop: "1px solid rgba(13,18,16,0.08)" }}>
            <p className="text-sm mb-3" style={{ color: "var(--vl-text-2)" }}>
              O aluno {lesson.student.user.name} compareceu nesta aula?
            </p>
            <InstructorConfirmButton lessonId={lesson.id} />
          </div>
        )}

        {lesson.studentConfirmed && lesson.status === LessonStatus.CONFIRMED && (
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ background: "oklch(92% 0.07 145)", color: "var(--vl-accent)" }}
          >
            <CheckCircle2 size={12} />
            Aluno já confirmou
          </div>
        )}

        {isCompleted && (
          <div className="space-y-6 mt-6 pt-5" style={{ borderTop: "1px solid rgba(13,18,16,0.08)" }}>
            {(myRating || ratingReceived) && (
              <div className="space-y-2">
                {myRating && (
                  <div className="flex items-center gap-2 text-sm">
                    <span style={{ color: "var(--vl-text-3)" }}>Você avaliou:</span>
                    <StarRating score={myRating.score} size={14} />
                    {myRating.comment && (
                      <span className="text-xs italic" style={{ color: "var(--vl-text-3)" }}>
                        “{myRating.comment}”
                      </span>
                    )}
                  </div>
                )}
                {ratingReceived && (
                  <div className="flex items-center gap-2 text-sm">
                    <span style={{ color: "var(--vl-text-3)" }}>Aluno avaliou:</span>
                    <StarRating score={ratingReceived.score} size={14} />
                    {ratingReceived.comment && (
                      <span className="text-xs italic" style={{ color: "var(--vl-text-3)" }}>
                        “{ratingReceived.comment}”
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
            {!alreadyRated && <RatingForm lessonId={lesson.id} targetLabel="aluno" />}
          </div>
        )}
      </div>
    </div>
  );
}
