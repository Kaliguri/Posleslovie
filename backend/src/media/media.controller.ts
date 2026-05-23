import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { IsNotEmpty, IsString } from "class-validator";

import { ApiKeyRoleGuard } from "../common/guards/api-key-role.guard";
import { MediaService } from "./media.service";

class CreateUploadQuery {
  @IsString()
  @IsNotEmpty()
  fileName!: string;
}

@Controller("admin/media")
@UseGuards(ApiKeyRoleGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get("upload-descriptor")
  createUploadDescriptor(@Query() query: CreateUploadQuery) {
    return this.mediaService.createUploadDescriptor(query.fileName);
  }
}
