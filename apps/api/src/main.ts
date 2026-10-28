import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";
import { configureApp } from "./configure-app.js";
import { readRuntimeConfig } from "./config/runtime-config.js";

async function bootstrap(): Promise<void> {
  const config = readRuntimeConfig(process.env);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  configureApp(app);
  await app.listen(config.port, config.host);
}

await bootstrap();
