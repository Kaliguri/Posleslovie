import { Body, Controller, Get, Headers, Post, Query, UseGuards } from "@nestjs/common";

import { ApiKeyRoleGuard } from "../common/guards/api-key-role.guard";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrdersService } from "./orders.service";

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post("public/orders")
  async create(@Body() body: CreateOrderDto) {
    const order = await this.ordersService.createOrder(body);
    return { order };
  }

  @UseGuards(ApiKeyRoleGuard)
  @Get("admin/orders")
  list(@Query("limit") limit: string, @Headers("x-role") role: string) {
    const parsedLimit = Number.parseInt(limit || "30", 10);
    const safeLimit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 100) : 30;
    return this.ordersService
      .addAudit(role, "order.list", "orders", { limit: safeLimit })
      .then(() => this.ordersService.listOrders(safeLimit));
  }
}
