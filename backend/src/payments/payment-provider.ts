export type CreatePaymentInput = {
  orderId: string;
  amount: number;
  currency: string;
  description: string;
  returnUrl: string;
};

export type CreatePaymentOutput = {
  externalPaymentId: string;
  confirmationUrl: string;
  status: "pending" | "succeeded" | "canceled";
};

export type PaymentWebhookInput = {
  externalPaymentId: string;
  status: "pending" | "succeeded" | "canceled";
  metadata?: Record<string, unknown>;
};

export interface PaymentProvider {
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentOutput>;
  parseWebhook(payload: unknown): PaymentWebhookInput;
}
