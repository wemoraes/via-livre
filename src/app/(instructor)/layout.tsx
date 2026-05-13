import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function InstructorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "INSTRUCTOR") redirect("/entrar");
  return <>{children}</>;
}
