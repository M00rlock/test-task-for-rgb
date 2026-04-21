import { ApiProperty } from "@nestjs/swagger";

import { DealSummaryDto } from "../../deals/dto/deal-summary.dto";
import { ClientSummaryDto } from "./client-summary.dto";

export class ClientWithDealsDto extends ClientSummaryDto {
  @ApiProperty({ type: () => DealSummaryDto, isArray: true })
  deals!: DealSummaryDto[];
}
