import { Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "@prisma/client";

import { PrismaService } from "../prisma.service";
import type { UpdateContentDto } from "./dto/update-content.dto";

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicPage(slug: string): Promise<{ slug: string; title: string; data: Prisma.JsonValue }> {
    const page = await this.prisma.contentPage.findUnique({
      where: { slug },
      select: { slug: true, title: true, data: true },
    });

    if (!page) {
      throw new NotFoundException(`Content page '${slug}' was not found`);
    }

    return page;
  }

  async upsertPage(
    slug: string,
    payload: UpdateContentDto,
    actor: string,
  ): Promise<{ slug: string; title: string; data: Prisma.JsonValue }> {
    const page = await this.prisma.contentPage.upsert({
      where: { slug },
      update: {
        title: payload.title ?? slug,
        data: payload.data as Prisma.InputJsonValue,
      },
      create: {
        slug,
        title: payload.title ?? slug,
        data: payload.data as Prisma.InputJsonValue,
      },
      select: { slug: true, title: true, data: true },
    });

    await this.prisma.auditLog.create({
      data: {
        actor,
        action: "content.upsert",
        target: slug,
        details: payload.data as Prisma.InputJsonValue,
      },
    });

    return page;
  }
}
