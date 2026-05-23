import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MediaService {
  constructor(private readonly configService: ConfigService) {}

  getPublicBaseUrl(): string {
    return this.configService.getOrThrow<string>("MEDIA_BUCKET_PUBLIC_URL");
  }

  // Placeholder for presigned URL flow, ready for S3-compatible storage.
  createUploadDescriptor(fileName: string): { uploadUrl: string; publicUrl: string } {
    const baseUrl = this.getPublicBaseUrl().replace(/\/$/, "");
    return {
      uploadUrl: `${baseUrl}/uploads/${encodeURIComponent(fileName)}`,
      publicUrl: `${baseUrl}/uploads/${encodeURIComponent(fileName)}`,
    };
  }
}
