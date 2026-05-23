import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";

import type {
  CreatePaymentInput,
  CreatePaymentOutput,
  PaymentProvider,
  PaymentWebhookInput,
} from "./payment-provider";

@Injectable()
export class MockPaymentProvider implements PaymentProvider {
  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentOutput> {
    const externalPaymentId = `mock_${randomUUID()}`;
    return {
      externalPaymentId,
      confirmationUrl: `${input.returnUrl}?mockPaymentId=${externalPaymentId}`,
      status: "pending",
    };
  }

  parseWebhook(payload: unknown): PaymentWebhookInput {
    const objectPayload = payload as Record<string, unknown>;
    const externalPaymentId = String(objectPayload.externalPaymentId ?? "");
    const status = String(objectPayload.status ?? "pending");
    if (!externalPaymentId) {
      throw new Error("externalPaymentId is required");
    }
    if (status !== "pending" && status !== "succeeded" && status !== "canceled") {
      throw new Error("Unsupported payment status");
    }
    return {
      externalPaymentId,
      status,
      metadata: objectPayload,
    };
  }
}
