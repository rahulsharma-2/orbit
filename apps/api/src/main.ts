import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";
import { RUNTIME_CONFIG } from "./config/runtime-config.module.js";
import { configureApp } from "./configure-app.js";
import type { RuntimeConfig } from "./config/runtime-config.js";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const config = app.get<RuntimeConfig>(RUNTIME_CONFIG);

  configureApp(app);
  await app.listen(config.port, config.host);
}

await bootstrap();
