import { PrismaClient, UserRole, InstructorStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hash } from "bcryptjs";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const pool = new Pool({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const password = await hash("Teste@2026", 12);

  // ─── Instrutor de teste ───────────────────────────────────────────────────────
  const existingInstructor = await prisma.user.findUnique({ where: { email: "instrutor@teste.vialivre" } });
  if (!existingInstructor) {
    const instructor = await prisma.user.create({
      data: {
        name: "João Instrutor Silva",
        email: "instrutor@teste.vialivre",
        password,
        role: UserRole.INSTRUCTOR,
        emailVerified: new Date(),
        instructorProfile: {
          create: {
            cpf: "12345678901",
            bio: "Instrutor com 10 anos de experiência em direção urbana e estrada. Especialista em primeira habilitação.",
            phone: "(11) 91234-5678",
            pricePerLesson: 150,
            serviceRadius: 20,
            city: "São Paulo",
            state: "SP",
            areas: ["Vila Madalena", "Pinheiros", "Itaim Bibi"],
            lat: -23.5505,
            lng: -46.6333,
            status: InstructorStatus.PENDING,
          },
        },
      },
    });
    console.log(`✓ Instrutor criado: ${instructor.email}`);
  } else {
    console.log(`  Instrutor já existe: ${existingInstructor.email}`);
  }

  // ─── Aluno de teste ───────────────────────────────────────────────────────────
  const existingStudent = await prisma.user.findUnique({ where: { email: "aluno@teste.vialivre" } });
  if (!existingStudent) {
    const student = await prisma.user.create({
      data: {
        name: "Maria Aluna Costa",
        email: "aluno@teste.vialivre",
        password,
        role: UserRole.STUDENT,
        emailVerified: new Date(),
        studentProfile: { create: {} },
      },
    });
    console.log(`✓ Aluno criado: ${student.email}`);
  } else {
    console.log(`  Aluno já existe: ${existingStudent.email}`);
  }

  console.log("\nSenha de ambos: Teste@2026");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
