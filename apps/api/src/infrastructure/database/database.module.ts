import { Module } from "@nestjs/common";

import { RuntimeConfigModule } from "../../config/runtime-config.module.js";
import { PrismaService } from "./prisma.service.js";

@Module({
  exports: [PrismaService],
  imports: [RuntimeConfigModule],
  providers: [PrismaService],
})
export class DatabaseModule {}
