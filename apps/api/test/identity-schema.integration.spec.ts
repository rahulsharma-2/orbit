import { randomUUID } from "node:crypto";

import { Test, type TestingModule } from "@nestjs/testing";

import { RuntimeConfigModule } from "../src/config/runtime-config.module.js";
import { DatabaseModule } from "../src/infrastructure/database/database.module.js";
import { PrismaService } from "../src/infrastructure/database/prisma.service.js";
import { configureLocalTestDatabase } from "./test-database.js";

const TEST_EMAIL_SUFFIX = "@schema.orbit.test";

configureLocalTestDatabase();

describe("identity database schema", () => {
  let database: PrismaService;
  let testingModule: TestingModule;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [RuntimeConfigModule, DatabaseModule],
    }).compile();
    database = testingModule.get(PrismaService);
  });

  afterEach(async () => {
    await database.user.deleteMany({
      where: { normalizedEmail: { endsWith: TEST_EMAIL_SUFFIX } },
    });
  });

  afterAll(async () => {
    await database.user.deleteMany({
      where: { normalizedEmail: { endsWith: TEST_EMAIL_SUFFIX } },
    });
    await testingModule.close();
  });

  it("enforces normalized-email uniqueness", async () => {
    const normalizedEmail = `${randomUUID()}${TEST_EMAIL_SUFFIX}`;
    const userData = {
      email: normalizedEmail,
      normalizedEmail,
      passwordHash: "$argon2id$test-only-hash",
    };

    await database.user.create({ data: userData });

    await expect(database.user.create({ data: userData })).rejects.toThrow();
  });

  it("rejects a session token that is not a SHA-256 hex digest", async () => {
    const normalizedEmail = `${randomUUID()}${TEST_EMAIL_SUFFIX}`;
    const user = await database.user.create({
      data: {
        email: normalizedEmail,
        normalizedEmail,
        passwordHash: "$argon2id$test-only-hash",
      },
    });

    await expect(
      database.session.create({
        data: {
          absoluteExpiresAt: new Date("2030-01-08T00:00:00.000Z"),
          idleExpiresAt: new Date("2030-01-02T00:00:00.000Z"),
          tokenDigest: "not-a-sha256-digest",
          userId: user.id,
        },
      }),
    ).rejects.toThrow();
  });

  it("deletes owned sessions when their user is deleted", async () => {
    const normalizedEmail = `${randomUUID()}${TEST_EMAIL_SUFFIX}`;
    const user = await database.user.create({
      data: {
        email: normalizedEmail,
        normalizedEmail,
        passwordHash: "$argon2id$test-only-hash",
        sessions: {
          create: {
            absoluteExpiresAt: new Date("2030-01-08T00:00:00.000Z"),
            idleExpiresAt: new Date("2030-01-02T00:00:00.000Z"),
            tokenDigest: "a".repeat(64),
          },
        },
      },
      include: { sessions: true },
    });
    const sessionId = user.sessions[0]?.id;

    if (sessionId === undefined) {
      throw new Error(
        "Expected nested session creation to return a session ID.",
      );
    }

    await database.user.delete({ where: { id: user.id } });

    await expect(
      database.session.findUnique({ where: { id: sessionId } }),
    ).resolves.toBeNull();
  });

  it("requires deletion-pending users to have a deletion timestamp", async () => {
    const normalizedEmail = `${randomUUID()}${TEST_EMAIL_SUFFIX}`;

    await expect(
      database.user.create({
        data: {
          email: normalizedEmail,
          normalizedEmail,
          passwordHash: "$argon2id$test-only-hash",
          status: "DELETION_PENDING",
        },
      }),
    ).rejects.toThrow();
  });
});
