import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";

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

  @UseGuards(ApiKeyRoleGuard)
  @Get("admin/content/:slug")
  getAdminContent(@Param("slug") slug: string) {
    return this.contentService.getAdminPage(slug);
  }

  @UseGuards(ApiKeyRoleGuard)
  @Get("admin/content/:slug/history")
  getContentHistory(
    @Param("slug") slug: string,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.contentService.listRevisions(slug, limit);
  }

  @UseGuards(ApiKeyRoleGuard)
  @Post("admin/content/:slug/restore/:revisionId")
  restoreContentRevision(
    @Param("slug") slug: string,
    @Param("revisionId", ParseIntPipe) revisionId: number,
    @Headers("x-role") role: string,
  ) {
    return this.contentService.restoreRevision(slug, revisionId, role);
  }
}
