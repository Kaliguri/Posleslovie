import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { randomUUID } from "node:crypto";

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

  listProjectImages(): string[] {
    const candidateRoots = [
      resolve(process.cwd(), "public", "images"),
      resolve(process.cwd(), "..", "public", "images"),
    ];
    const imagesRoot = candidateRoots.find((path) => existsSync(path));

    if (!imagesRoot) {
      return [];
    }
    const imagesRootPath = imagesRoot;

    const imagePaths: string[] = [];

    function walk(currentPath: string) {
      const entries = readdirSync(currentPath);
      for (const entry of entries) {
        const fullPath = join(currentPath, entry);
        const entryStat = statSync(fullPath);
        if (entryStat.isDirectory()) {
          walk(fullPath);
          continue;
        }
        if (!/\.(png|jpe?g|webp|gif|svg)$/i.test(entry)) {
          continue;
        }
        const relative = fullPath.replace(imagesRootPath, "").replace(/\\/g, "/");
        imagePaths.push(`/images${relative}`);
      }
    }

    walk(imagesRoot);
    return imagePaths.sort((a, b) => a.localeCompare(b));
  }

  saveDataUrlImage(dataUrl: string, requestedFileName?: string): { publicPath: string } {
    const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) {
      throw new Error("Unsupported data URL format. Expected base64 image data URL.");
    }

    const mimeType = match[1];
    const base64Content = match[2];
    const extension = this.mimeToExtension(mimeType);
    const safeName = this.sanitizeFileName(requestedFileName ?? "image");
    const fileName = `${safeName}-${randomUUID().slice(0, 8)}.${extension}`;

    const projectPublicRootCandidates = [
      resolve(process.cwd(), "public", "images", "uploads"),
      resolve(process.cwd(), "..", "public", "images", "uploads"),
    ];
    const targetDir =
      projectPublicRootCandidates.find((path) => existsSync(resolve(path, ".."))) ??
      projectPublicRootCandidates[1];

    mkdirSync(targetDir, { recursive: true });
    const targetPath = join(targetDir, fileName);
    const imageBuffer = Buffer.from(base64Content, "base64");
    writeFileSync(targetPath, imageBuffer);

    return {
      publicPath: `/images/uploads/${fileName}`,
    };
  }

  private mimeToExtension(mimeType: string): string {
    const map: Record<string, string> = {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/webp": "webp",
      "image/gif": "gif",
      "image/svg+xml": "svg",
    };
    const extension = map[mimeType.toLowerCase()];
    if (!extension) {
      throw new Error(`Unsupported image MIME type: ${mimeType}`);
    }
    return extension;
  }

  private sanitizeFileName(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "image";
  }
}
