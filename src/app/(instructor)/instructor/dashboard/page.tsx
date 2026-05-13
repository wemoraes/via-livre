import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getInstructorDashboardData } from "./_data/dashboard";
import { formatCountdown } from "@/lib/datetime";
import DocumentExpiryAlert from "./_components/DocumentExpiryAlert";
import PendingRequestsCard from "./_components/PendingRequestsCard";
import NextLessonCard from "./_components/NextLessonCard";
import EmptyInstructorHero from "./_components/EmptyInstructorHero";
import RevenueCard from "./_components/RevenueCard";
import AprovometroCard from "./_components/AprovometroCard";
import RatingCard from "./_components/RatingCard";
import UpcomingLessonsList from "./_components/UpcomingLessonsList";

export default async function InstructorDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/entrar");

  const data = await getInstructorDashboardData(session.user.id);

  let subtitle: string;
  if (data.nextLesson) {
    subtitle = `Próxima aula ${formatCountdown(data.nextLesson.scheduledAt).toLowerCase()}.`;
  } else if (data.pendingRequests.length > 0) {
    subtitle = "Você tem pedidos aguardando confirmação.";
  } else if (data.stats.completedThisMonth > 0) {
    subtitle = "Bons ventos para o mês.";
  } else {
    subtitle = "Bora atrair os primeiros alunos.";
  }

  return (
    <div className="max-w-4xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--vl-text-1)" }}>
          Olá, {data.firstName}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--vl-text-3)" }}>{subtitle}</p>
      </header>

      <DocumentExpiryAlert documents={data.expiringDocuments} />

      <PendingRequestsCard requests={data.pendingRequests} />

      {data.nextLesson ? (
        <NextLessonCard lesson={data.nextLesson} />
      ) : (
        data.stats.completedThisMonth === 0 && data.stats.upcomingCount === 0 && <EmptyInstructorHero />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <RevenueCard
          monthRevenue={data.stats.monthRevenue}
          completedThisMonth={data.stats.completedThisMonth}
        />
        <AprovometroCard
          aprovometro={data.stats.aprovometro}
          aprovometroCount={data.stats.aprovometroCount}
        />
        <RatingCard
          avgRating={data.stats.avgRating}
          ratingsCount={data.stats.ratingsCount}
        />
      </div>

      <UpcomingLessonsList upcoming={data.upcoming} totalUpcoming={data.stats.upcomingCount} />
    </div>
  );
}
