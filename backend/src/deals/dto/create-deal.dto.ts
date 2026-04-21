import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { DealStatus } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";

export class CreateDealDto {
  @ApiProperty({ example: "Website redesign", description: "Deal title" })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 2500, description: "Deal amount, must be greater than 0" })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiPropertyOptional({ enum: DealStatus, example: DealStatus.NEW, description: "Optional deal status" })
  @IsOptional()
  @IsEnum(DealStatus)
  status?: DealStatus;

  @ApiProperty({ example: "0d3c4f66-2b1a-4c1c-9e48-5bbf0b9a4d11", description: "Related client ID" })
  @IsUUID()
  clientId!: string;
}
