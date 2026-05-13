import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import InstructorSidebar from "@/components/features/instructor/InstructorSidebar";
import InstructorBottomNav from "@/components/features/instructor/InstructorBottomNav";
import InstructorHeader from "@/components/features/instructor/InstructorHeader";

export default async function InstructorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "INSTRUCTOR") redirect("/entrar");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, image: true },
  });
  const name = user?.name ?? session.user.email ?? "Instrutor";
  const avatarUrl = user?.image ?? null;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "var(--font-plus-jakarta-sans), system-ui, sans-serif" }}
    >
      <div aria-hidden className="vl-mesh" />

      <InstructorHeader name={name} avatarUrl={avatarUrl} />

      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8 pb-24 md:pb-8 flex gap-6">
        <InstructorSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      <InstructorBottomNav />
    </div>
  );
}
