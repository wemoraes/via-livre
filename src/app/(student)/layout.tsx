import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import StudentSidebar from "@/components/features/student/StudentSidebar";
import StudentBottomNav from "@/components/features/student/StudentBottomNav";
import StudentHeader from "@/components/features/student/StudentHeader";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") redirect("/entrar");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, image: true },
  });
  const name = user?.name ?? session.user.email ?? "Aluno";
  const avatarUrl = user?.image ?? null;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "var(--font-plus-jakarta-sans), system-ui, sans-serif" }}
    >
      <div aria-hidden className="vl-mesh" />

      <StudentHeader name={name} avatarUrl={avatarUrl} />

      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8 pb-24 md:pb-8 flex gap-6">
        <StudentSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      <StudentBottomNav />
    </div>
  );
}
