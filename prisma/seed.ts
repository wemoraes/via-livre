import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hash } from "crypto";

const pool = new Pool({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = "admin@viaLivre.com.br";

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log("Admin já existe, pulando seed.");
    return;
  }

  // Simple hash for seed only — real passwords use bcrypt in the app
  const passwordHash = hash("sha256", "admin123");

  await prisma.user.create({
    data: {
      email: adminEmail,
      name: "Admin ViaLivre",
      role: UserRole.ADMIN,
      password: passwordHash,
      emailVerified: new Date(),
    },
  });

  console.log("✅ Admin criado: admin@viaLivre.com.br");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
