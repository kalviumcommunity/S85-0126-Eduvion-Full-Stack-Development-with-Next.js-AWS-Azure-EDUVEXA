import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  datasource: {
    url: "postgresql://postgres:18155373@localhost:5432/mydb",
  },
});
