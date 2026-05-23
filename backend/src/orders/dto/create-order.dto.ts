import { IsEmail, IsInt, IsOptional, IsPositive, IsString, MaxLength, Min } from "class-validator";

export class CreateOrderDto {
  @IsString()
  @MaxLength(120)
  customerName!: string;

  @IsEmail()
  customerEmail!: string;

  @IsString()
  @MaxLength(32)
  customerPhone!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsInt()
  @IsPositive()
  totalAmount!: number;

  @IsOptional()
  @IsString()
  @MaxLength(600)
  comment?: string;
}
