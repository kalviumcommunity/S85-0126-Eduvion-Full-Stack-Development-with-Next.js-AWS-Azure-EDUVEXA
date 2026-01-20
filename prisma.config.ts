import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    seed: "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts",
  },

  datasource: {
    url: "postgresql://postgres:18155373@localhost:5432/mydb",
  },
});