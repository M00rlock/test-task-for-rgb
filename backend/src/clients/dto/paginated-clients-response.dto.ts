import { ApiProperty } from "@nestjs/swagger";

import { PaginationMetaDto } from "../../common/dto/pagination-meta.dto";
import { ClientSummaryDto } from "./client-summary.dto";

export class PaginatedClientsResponseDto {
  @ApiProperty({ type: () => ClientSummaryDto, isArray: true })
  data!: ClientSummaryDto[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta!: PaginationMetaDto;
}
