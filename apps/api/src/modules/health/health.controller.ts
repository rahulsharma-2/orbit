import { Controller, Get } from "@nestjs/common";

export interface LivenessResponse {
  readonly service: "orbit-api";
  readonly status: "ok";
}

@Controller("health")
export class HealthController {
  @Get("live")
  getLiveness(): LivenessResponse {
    return {
      service: "orbit-api",
      status: "ok",
    };
  }
}
