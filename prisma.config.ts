import "dotenv/config";
import { defineConfig } from "prisma/config";

// DATABASE_URL = transaction pooler (porta 6543, pgBouncer) — queries
// DIRECT_URL   = direct connection (porta 5432)             — migrations
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
