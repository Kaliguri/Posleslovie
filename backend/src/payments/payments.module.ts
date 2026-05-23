import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { OrdersModule } from "../orders/orders.module";
import { PrismaService } from "../prisma.service";
import { MockPaymentProvider } from "./mock-payment.provider";
import { PaymentsController } from "./payments.controller";
import { PAYMENT_PROVIDER_TOKEN, PaymentsService } from "./payments.service";

@Module({
  imports: [OrdersModule],
  controllers: [PaymentsController],
  providers: [
    PrismaService,
    PaymentsService,
    MockPaymentProvider,
    {
      provide: PAYMENT_PROVIDER_TOKEN,
      useFactory: (configService: ConfigService, mockProvider: MockPaymentProvider) => {
        const provider = configService.get("PAYMENT_PROVIDER");
        if (provider === "yookassa_like") {
          return mockProvider;
        }
        return mockProvider;
      },
      inject: [ConfigService, MockPaymentProvider],
    },
  ],
})
export class PaymentsModule {}
