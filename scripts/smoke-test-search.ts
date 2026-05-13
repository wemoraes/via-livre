import { PrismaClient, InstructorStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const pool = new Pool({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

function fail(message: string): never {
  console.error(`✗ FAIL: ${message}`);
  process.exit(1);
}

function pass(message: string): void {
  console.log(`✓ ${message}`);
}

async function main() {
  console.log("Running smoke test for searchInstructors...\n");

  // Query directly against the database to mirror what searchInstructors does
  // (avoids dragging Next.js / Redis runtime into the test script).
  const profiles = await prisma.instructorProfile.findMany({
    where: {
      status: InstructorStatus.ACTIVE,
      stripeOnboardingDone: true,
    },
    include: { user: { select: { name: true, email: true } } },
  });

  if (profiles.length === 0) {
    fail("Nenhum instrutor ACTIVE + stripeOnboardingDone:true encontrado. Rode `npx tsx scripts/seed-test-users.ts` primeiro.");
  }
  pass(`Encontrados ${profiles.length} instrutor(es) elegível(eis) para busca.`);

  const demoInstructor = profiles.find((p) => p.user.email === "instrutor.ativo@teste.vialivre");
  if (!demoInstructor) {
    fail("Instrutor de demo `instrutor.ativo@teste.vialivre` não encontrado. Rode o seed.");
  }
  pass(`Instrutor de demo presente: ${demoInstructor.user.name} (${demoInstructor.user.email})`);

  if (!demoInstructor.lat || !demoInstructor.lng) {
    fail("Instrutor de demo sem lat/lng — não aparecerá em busca geolocalizada.");
  }
  pass(`Geolocalização ok: ${demoInstructor.lat}, ${demoInstructor.lng}`);

  if (demoInstructor.areas.length === 0) {
    fail("Instrutor de demo sem áreas de atuação.");
  }
  pass(`Áreas: ${demoInstructor.areas.join(", ")}`);

  if (Number(demoInstructor.pricePerLesson) <= 0) {
    fail("Instrutor de demo com pricePerLesson inválido.");
  }
  pass(`Preço por aula: R$ ${Number(demoInstructor.pricePerLesson)}`);

  const docs = await prisma.document.findMany({
    where: { instructorId: demoInstructor.id },
    select: { type: true, status: true, expiresAt: true },
  });
  if (docs.length < 5) {
    fail(`Instrutor de demo com apenas ${docs.length}/5 documentos.`);
  }
  const allApproved = docs.every((d) => d.status === "APPROVED");
  const allHaveExpiry = docs.every((d) => d.expiresAt !== null);
  if (!allApproved) {
    fail("Nem todos os 5 documentos estão APPROVED.");
  }
  if (!allHaveExpiry) {
    fail("Alguns documentos do instrutor de demo estão sem expiresAt — quebraria processDocumentExpiryAlerts.");
  }
  pass(`5 documentos APPROVED com expiresAt populado.`);

  const vehicles = await prisma.vehicle.count({ where: { instructorId: demoInstructor.id, active: true } });
  if (vehicles === 0) {
    fail("Instrutor de demo sem veículo ativo.");
  }
  pass(`Veículo(s) ativo(s): ${vehicles}`);

  const availability = await prisma.availability.count({ where: { instructorId: demoInstructor.id, active: true } });
  if (availability === 0) {
    fail("Instrutor de demo sem availability — alunos não conseguirão agendar.");
  }
  pass(`Slots de availability ativos: ${availability}`);

  console.log("\n✓ Smoke test passou. Epic 4 (Descoberta) destravado.");
}

main()
  .catch((e) => {
    console.error("Erro inesperado:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
