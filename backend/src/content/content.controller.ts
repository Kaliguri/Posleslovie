import { Body, Controller, Get, Headers, Param, Put, UseGuards } from "@nestjs/common";

import { ApiKeyRoleGuard } from "../common/guards/api-key-role.guard";
import { UpdateContentDto } from "./dto/update-content.dto";
import { ContentService } from "./content.service";

@Controller()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get("public/content/:slug")
  getPublicContent(@Param("slug") slug: string) {
    return this.contentService.getPublicPage(slug);
  }

  @UseGuards(ApiKeyRoleGuard)
  @Put("admin/content/:slug")
  updateContent(
    @Param("slug") slug: string,
    @Body() body: UpdateContentDto,
    @Headers("x-role") role: string,
  ) {
    return this.contentService.upsertPage(slug, body, role);
  }
}
