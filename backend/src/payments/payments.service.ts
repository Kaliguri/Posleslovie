import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PaymentStatus, type Prisma } from "@prisma/client";

import { OrdersService } from "../orders/orders.service";
import { PrismaService } from "../prisma.service";
import type { CreatePaymentDto } from "./dto/create-payment.dto";
import type { PaymentProvider } from "./payment-provider";

export const PAYMENT_PROVIDER_TOKEN = "PAYMENT_PROVIDER_TOKEN";

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ordersService: OrdersService,
    @Inject(PAYMENT_PROVIDER_TOKEN) private readonly paymentProvider: PaymentProvider,
  ) {}

  async createPayment(payload: CreatePaymentDto) {
    const order = await this.prisma.order.findUnique({ where: { id: payload.orderId } });
    if (!order) {
      throw new NotFoundException(`Order '${payload.orderId}' not found`);
    }

    const created = await this.paymentProvider.createPayment({
      orderId: payload.orderId,
      amount: payload.amount,
      currency: payload.currency ?? "RUB",
      description: payload.description ?? `Оплата заказа ${payload.orderId}`,
      returnUrl: "http://localhost:3000/payment-return",
    });

    const payment = await this.prisma.payment.create({
      data: {
        orderId: payload.orderId,
        amount: payload.amount,
        currency: payload.currency ?? "RUB",
        status: PaymentStatus.PENDING,
        provider: "mock",
        externalPaymentId: created.externalPaymentId,
      },
    });

    await this.prisma.paymentEvent.create({
      data: {
        paymentId: payment.id,
        eventType: "payment.created",
        payload: {
          confirmationUrl: created.confirmationUrl,
          providerStatus: created.status,
        } as Prisma.InputJsonValue,
      },
    });

    return {
      paymentId: payment.id,
      orderId: payment.orderId,
      confirmationUrl: created.confirmationUrl,
      status: payment.status,
    };
  }

  async handleWebhook(payload: unknown, idempotencyKey: string | undefined) {
    const parsed = this.paymentProvider.parseWebhook(payload);

    const payment = await this.prisma.payment.findUnique({
      where: { externalPaymentId: parsed.externalPaymentId },
    });
    if (!payment) {
      throw new NotFoundException(`Payment '${parsed.externalPaymentId}' not found`);
    }

    const nextStatus =
      parsed.status === "succeeded"
        ? PaymentStatus.SUCCEEDED
        : parsed.status === "canceled"
          ? PaymentStatus.CANCELED
          : PaymentStatus.PENDING;

    const updated = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: nextStatus,
        idempotencyKey: idempotencyKey ?? payment.idempotencyKey,
      },
    });

    await this.prisma.paymentEvent.create({
      data: {
        paymentId: updated.id,
        eventType: "payment.webhook",
        payload: (parsed.metadata ?? {}) as Prisma.InputJsonValue,
      },
    });

    if (nextStatus === PaymentStatus.SUCCEEDED) {
      await this.ordersService.updateStatus(updated.orderId, "PAID");
    }

    if (nextStatus === PaymentStatus.CANCELED) {
      await this.ordersService.updateStatus(updated.orderId, "CANCELED");
    }

    return { ok: true, paymentId: updated.id, status: nextStatus };
  }
}
