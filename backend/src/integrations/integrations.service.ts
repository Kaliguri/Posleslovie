import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);

  async notifyOrderCreated(orderId: string): Promise<void> {
    // Ready to connect amoCRM/Telegram/email providers.
    this.logger.log(`Integration event queued for order ${orderId}`);
  }
}
