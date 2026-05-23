import { IsInt, IsOptional, IsPositive, IsString, IsUUID, MaxLength } from "class-validator";

export class CreatePaymentDto {
  @IsUUID()
  orderId!: string;

  @IsInt()
  @IsPositive()
  amount!: number;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;
}
