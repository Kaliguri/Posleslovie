import { Body, Controller, Headers, HttpCode, Post, UseGuards } from "@nestjs/common";

import { ApiKeyRoleGuard } from "../common/guards/api-key-role.guard";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { PaymentsService } from "./payments.service";

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(ApiKeyRoleGuard)
  @Post("admin/payments")
  createPayment(@Body() body: CreatePaymentDto) {
    return this.paymentsService.createPayment(body);
  }

  @HttpCode(200)
  @Post("public/payments/webhook")
  handleWebhook(
    @Body() payload: unknown,
    @Headers("x-idempotency-key") idempotencyKey: string | undefined,
  ) {
    return this.paymentsService.handleWebhook(payload, idempotencyKey);
  }
}
