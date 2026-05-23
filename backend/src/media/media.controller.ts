import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

import { ApiKeyRoleGuard } from "../common/guards/api-key-role.guard";
import { MediaService } from "./media.service";

class CreateUploadQuery {
  @IsString()
  @IsNotEmpty()
  fileName!: string;
}

class SaveDataUrlImageDto {
  @IsString()
  @IsNotEmpty()
  dataUrl!: string;

  @IsOptional()
  @IsString()
  fileName?: string;
}

@Controller("admin/media")
@UseGuards(ApiKeyRoleGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get("library")
  getLibrary() {
    return {
      images: this.mediaService.listProjectImages(),
    };
  }

  @Get("upload-descriptor")
  createUploadDescriptor(@Query() query: CreateUploadQuery) {
    return this.mediaService.createUploadDescriptor(query.fileName);
  }

  @Post("save-data-url")
  saveDataUrl(@Body() body: SaveDataUrlImageDto) {
    return this.mediaService.saveDataUrlImage(body.dataUrl, body.fileName);
  }
}
