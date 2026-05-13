import {
  PrismaClient,
  UserRole,
  InstructorStatus,
  DocumentType,
  DocumentStatus,
  VehicleCategory,
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hash } from "bcryptjs";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const pool = new Pool({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const ALL_DOCUMENT_TYPES: DocumentType[] = [
  DocumentType.CNH_EAR,
  DocumentType.SENATRAN_CREDENTIAL,
  DocumentType.CRIMINAL_CERTIFICATE,
  DocumentType.TAX_CERTIFICATE,
  DocumentType.CRLV,
];

async function main() {
  const password = await hash("Teste@2026", 12);

  // ─── Instrutor PENDING (onboarding completo) ──────────────────────────────────
  const existingPending = await prisma.user.findUnique({ where: { email: "instrutor@teste.vialivre" } });
  if (!existingPending) {
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
    console.log(`✓ Instrutor PENDING criado: ${instructor.email}`);
  } else {
    console.log(`  Instrutor PENDING já existe: ${existingPending.email}`);
  }

  // ─── Instrutor ACTIVE (elegível para busca / demo Epic 4) ─────────────────────
  const existingActive = await prisma.user.findUnique({
    where: { email: "instrutor.ativo@teste.vialivre" },
    include: { instructorProfile: true },
  });
  if (!existingActive) {
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const user = await prisma.user.create({
      data: {
        name: "Carlos Demo Almeida",
        email: "instrutor.ativo@teste.vialivre",
        password,
        role: UserRole.INSTRUCTOR,
        emailVerified: new Date(),
        instructorProfile: {
          create: {
            cpf: "98765432100",
            bio: "Instrutor sênior credenciado SENATRAN com 15 anos de experiência. Foco em direção defensiva, vagas em ré e percurso DETRAN-SP. Disponibilidade aos sábados.",
            phone: "(11) 98765-4321",
            pricePerLesson: 180,
            serviceRadius: 25,
            city: "São Paulo",
            state: "SP",
            areas: ["Pinheiros", "Vila Olímpia", "Itaim Bibi", "Moema"],
            lat: -23.5648,
            lng: -46.6892,
            status: InstructorStatus.ACTIVE,
            stripeAccountId: "acct_test_active_demo",
            stripeOnboardingDone: true,
            aprovometro: 3.5,
            aprovometroCount: 8,
            totalLessons: 42,
            avgRating: 4.8,
          },
        },
      },
      include: { instructorProfile: true },
    });

    const profileId = user.instructorProfile!.id;

    await prisma.document.createMany({
      data: ALL_DOCUMENT_TYPES.map((type) => ({
        instructorId: profileId,
        type,
        status: DocumentStatus.APPROVED,
        storageKey: `seed/demo/${type.toLowerCase()}.pdf`,
        expiresAt,
      })),
      skipDuplicates: true,
    });

    await prisma.vehicle.create({
      data: {
        instructorId: profileId,
        plate: "DEM-0A26",
        brand: "Volkswagen",
        model: "Polo Track",
        year: 2025,
        color: "Prata",
        category: VehicleCategory.AUTO,
        isPrimary: true,
        active: true,
      },
    });

    await prisma.availability.createMany({
      data: [1, 2, 3, 4, 5, 6].map((dayOfWeek) => ({
        instructorId: profileId,
        dayOfWeek,
        startTime: "08:00",
        endTime: "18:00",
        active: true,
      })),
      skipDuplicates: true,
    });

    console.log(`✓ Instrutor ACTIVE criado: ${user.email} (com 5 docs APPROVED, 1 veículo, 6 dias de availability)`);
  } else {
    console.log(`  Instrutor ACTIVE já existe: ${existingActive.email}`);
  }

  // ─── Aluno ────────────────────────────────────────────────────────────────────
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

  console.log("\nSenha de todos os usuários: Teste@2026");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
