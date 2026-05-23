import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import type { AppRole } from "../common/guards/api-key-role.guard";

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  resolveRoleByApiKey(apiKey: string): AppRole {
    const adminKey = this.configService.getOrThrow<string>("API_KEY_ADMIN");
    const managerKey = this.configService.getOrThrow<string>("API_KEY_MANAGER");

    if (apiKey === adminKey) {
      return "admin";
    }
    if (apiKey === managerKey) {
      return "manager";
    }

    throw new UnauthorizedException("Invalid API key");
  }
}
