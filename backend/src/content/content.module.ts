import { Module } from "@nestjs/common";

import { PrismaService } from "../prisma.service";
import { ContentController } from "./content.controller";
import { ContentService } from "./content.service";

@Module({
  controllers: [ContentController],
  providers: [ContentService, PrismaService],
  exports: [ContentService],
})
export class ContentModule {}
