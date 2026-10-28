import { Controller, Get } from "@nestjs/common";

import { HealthService, type ReadinessResponse } from "./health.service.js";

export interface LivenessResponse {
  readonly service: "orbit-api";
  readonly status: "ok";
}

@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get("live")
  getLiveness(): LivenessResponse {
    return {
      service: "orbit-api",
      status: "ok",
    };
  }

  @Get("ready")
  getReadiness(): Promise<ReadinessResponse> {
    return this.healthService.checkReadiness();
  }
}
