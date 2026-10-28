import { Test, type TestingModule } from "@nestjs/testing";
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { AppModule } from "../src/app.module.js";
import { configureApp } from "../src/configure-app.js";
import { configureLocalTestDatabase } from "./test-database.js";

configureLocalTestDatabase();

describe("health endpoint", () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    configureApp(app);
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it("reports the API process as live through the versioned base path", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/health/live",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      service: "orbit-api",
      status: "ok",
    });
  });

  it("reports ready when PostgreSQL accepts a query", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/health/ready",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      dependencies: { database: "up" },
      status: "ready",
    });
  });
});
