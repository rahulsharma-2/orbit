import { Injectable, ServiceUnavailableException } from "@nestjs/common";

import { PrismaService } from "../../infrastructure/database/prisma.service.js";

export interface ReadinessResponse {
  readonly dependencies: {
    readonly database: "up";
  };
  readonly status: "ready";
}

@Injectable()
export class HealthService {
  constructor(private readonly database: PrismaService) {}

  async checkReadiness(): Promise<ReadinessResponse> {
    try {
      await this.database.$queryRaw`SELECT 1`;

      return {
        dependencies: { database: "up" },
        status: "ready",
      };
    } catch {
      throw new ServiceUnavailableException({
        dependencies: { database: "down" },
        status: "not_ready",
      });
    }
  }
}
