import type { UserRole, InstructorStatus } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: UserRole;
    instructorStatus?: InstructorStatus | null;
  }

  interface Session {
    user: {
      id: string;
      role: UserRole;
      instructorStatus?: InstructorStatus | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    instructorStatus?: InstructorStatus | null;
  }
}
