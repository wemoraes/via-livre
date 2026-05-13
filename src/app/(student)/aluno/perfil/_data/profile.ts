import { prisma } from "@/lib/db";

export interface StudentProfileData {
  name: string;
  email: string;
  avatarUrl: string | null;
  phone: string;
  city: string;
  state: string;
}

export async function getStudentProfileData(userId: string): Promise<StudentProfileData> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      image: true,
      studentProfile: { select: { phone: true, city: true, state: true } },
    },
  });
  if (!user) throw new Error("Usuário não encontrado");

  return {
    name: user.name ?? "",
    email: user.email,
    avatarUrl: user.image,
    phone: user.studentProfile?.phone ?? "",
    city: user.studentProfile?.city ?? "",
    state: user.studentProfile?.state ?? "",
  };
}
