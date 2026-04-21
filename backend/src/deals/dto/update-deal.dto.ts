import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { DealStatus } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";

export class UpdateDealDto {
  @ApiPropertyOptional({ example: "Website redesign", description: "Deal title" })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 2500, description: "Deal amount, must be greater than 0" })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @ApiPropertyOptional({ enum: DealStatus, example: DealStatus.IN_PROGRESS, description: "Deal status" })
  @IsOptional()
  @IsEnum(DealStatus)
  status?: DealStatus;

  @ApiPropertyOptional({ example: "0d3c4f66-2b1a-4c1c-9e48-5bbf0b9a4d11", description: "Related client ID" })
  @IsOptional()
  @IsUUID()
  clientId?: string;
}
