import { IsObject, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateContentDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @IsObject()
  data!: Record<string, unknown>;
}
