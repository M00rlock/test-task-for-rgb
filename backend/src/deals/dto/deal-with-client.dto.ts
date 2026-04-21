import { ApiProperty } from "@nestjs/swagger";

import { ClientSummaryDto } from "../../clients/dto/client-summary.dto";
import { DealSummaryDto } from "./deal-summary.dto";

export class DealWithClientDto extends DealSummaryDto {
  @ApiProperty({ type: () => ClientSummaryDto })
  client!: ClientSummaryDto;
}
