import { Module } from "@nestjs/common";

import { readRuntimeConfig } from "./runtime-config.js";

export const RUNTIME_CONFIG = Symbol("RUNTIME_CONFIG");

@Module({
  exports: [RUNTIME_CONFIG],
  providers: [
    {
      provide: RUNTIME_CONFIG,
      useFactory: () => readRuntimeConfig(process.env),
    },
  ],
})
export class RuntimeConfigModule {}
