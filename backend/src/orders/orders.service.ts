import { Injectable } from "@nestjs/common";
import { OrderStatus, type Prisma } from "@prisma/client";

import { PrismaService } from "../prisma.service";
import type { CreateOrderDto } from "./dto/create-order.dto";

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(payload: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        customerName: payload.customerName,
        customerEmail: payload.customerEmail,
        customerPhone: payload.customerPhone,
        quantity: payload.quantity,
        totalAmount: payload.totalAmount,
        comment: payload.comment ?? null,
      },
    });
  }

  async updateStatus(orderId: string, status: OrderStatus, comment?: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        comment: comment ?? undefined,
      },
    });
  }

  async listOrders(limit = 30) {
    return this.prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async addAudit(actor: string, action: string, target: string, details: Prisma.InputJsonValue) {
    await this.prisma.auditLog.create({
      data: { actor, action, target, details },
    });
  }
}
