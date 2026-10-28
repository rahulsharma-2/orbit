import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { defineConfig, env } from "prisma/config";

const repositoryEnvironmentPath = resolve(import.meta.dirname, "../../.env");

if (existsSync(repositoryEnvironmentPath)) {
  process.loadEnvFile(repositoryEnvironmentPath);
}

export default defineConfig({
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    path: "prisma/migrations",
  },
  schema: "prisma/schema.prisma",
});
