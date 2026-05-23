import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export type AppRole = "admin" | "manager";

@Injectable()
export class ApiKeyRoleGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined> }>();
    const incomingApiKey = request.headers["x-api-key"];

    if (!incomingApiKey) {
      throw new UnauthorizedException("Missing x-api-key");
    }

    const adminKey = this.configService.getOrThrow<string>("API_KEY_ADMIN");
    const managerKey = this.configService.getOrThrow<string>("API_KEY_MANAGER");
    const role: AppRole | null =
      incomingApiKey === adminKey ? "admin" : incomingApiKey === managerKey ? "manager" : null;

    if (!role) {
      throw new UnauthorizedException("Invalid API key");
    }

    request.headers["x-role"] = role;
    return true;
  }
}
