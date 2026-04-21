import { ApiProperty } from "@nestjs/swagger";
import { DealStatus } from "@prisma/client";

export class DealSummaryDto {
  @ApiProperty({ format: "uuid", example: "7968aeae-ffca-4d87-8778-5db56dab98d9" })
  id!: string;

  @ApiProperty({ example: "Website redesign" })
  title!: string;

  @ApiProperty({ example: 2500 })
  amount!: number;

  @ApiProperty({ enum: DealStatus, example: DealStatus.IN_PROGRESS })
  status!: DealStatus;

  @ApiProperty({ format: "uuid", example: "8eb9d544-eadf-499a-9815-31645349d1cf" })
  clientId!: string;

  @ApiProperty({ type: String, example: "2026-04-21T10:56:41.197Z" })
  createdAt!: Date;

  @ApiProperty({ type: String, example: "2026-04-21T10:56:41.197Z" })
  updatedAt!: Date;
}
