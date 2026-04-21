import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { DealStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsUUID } from "class-validator";

export class ListDealsQueryDto {
  @ApiPropertyOptional({ enum: DealStatus, example: DealStatus.NEW })
  @IsOptional()
  @IsEnum(DealStatus)
  status?: DealStatus;

  @ApiPropertyOptional({ format: "uuid", example: "8eb9d544-eadf-499a-9815-31645349d1cf" })
  @IsOptional()
  @Type(() => String)
  @IsUUID()
  clientId?: string;
}
