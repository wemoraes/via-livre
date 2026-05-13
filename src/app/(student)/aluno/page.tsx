import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getStudentDashboardData } from "./_data/dashboard";
import NextLessonCard from "./_components/NextLessonCard";
import StatsCards from "./_components/StatsCards";
import UpcomingLessonsCard from "./_components/UpcomingLessonsCard";
import EmptyHero from "./_components/EmptyHero";
import { formatCountdown } from "@/lib/datetime";

export default async function StudentHomePage() {
  const session = await auth();
  if (!session?.user) redirect("/entrar");

  const data = await getStudentDashboardData(session.user.id);

  let subtitle: string;
  if (data.nextLesson) {
    subtitle = `Próxima aula ${formatCountdown(data.nextLesson.scheduledAt).toLowerCase()}.`;
  } else if (data.stats.completedCount > 0) {
    subtitle = "Bora marcar a próxima?";
  } else {
    subtitle = "Bora encontrar seu primeiro instrutor?";
  }

  return (
    <div className="max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--vl-text-1)" }}>
          Olá, {data.firstName}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--vl-text-3)" }}>{subtitle}</p>
      </header>

      {data.nextLesson ? (
        <NextLessonCard lesson={data.nextLesson} />
      ) : (
        <EmptyHero />
      )}

      <StatsCards stats={data.stats} />

      <UpcomingLessonsCard upcoming={data.upcoming} totalUpcoming={data.stats.upcomingCount} />
    </div>
  );
}
