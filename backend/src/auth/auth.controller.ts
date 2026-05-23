import { Controller, Get, Headers } from "@nestjs/common";

import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("me")
  getMe(@Headers("x-api-key") apiKey: string): { role: string } {
    const role = this.authService.resolveRoleByApiKey(apiKey);
    return { role };
  }
}
