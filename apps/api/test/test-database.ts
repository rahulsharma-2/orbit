const DEFAULT_TEST_DATABASE_URL =
  "postgresql://orbit:root@localhost:5432/orbit";
const ALLOWED_TEST_DATABASE_HOSTS = new Set(["127.0.0.1", "::1", "localhost"]);

export function configureLocalTestDatabase(): void {
  const databaseUrl = process.env.DATABASE_URL ?? DEFAULT_TEST_DATABASE_URL;
  const hostname = new URL(databaseUrl).hostname;

  if (!ALLOWED_TEST_DATABASE_HOSTS.has(hostname)) {
    throw new Error(
      `Refusing to run integration tests against non-local database host: ${hostname}`,
    );
  }

  process.env.DATABASE_URL = databaseUrl;
}
