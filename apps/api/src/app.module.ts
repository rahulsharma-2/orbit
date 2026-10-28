import { Module } from "@nestjs/common";

import { RuntimeConfigModule } from "./config/runtime-config.module.js";
import { DatabaseModule } from "./infrastructure/database/database.module.js";
import { HealthModule } from "./modules/health/health.module.js";

@Module({
  imports: [RuntimeConfigModule, DatabaseModule, HealthModule],
})
export class AppModule {}
