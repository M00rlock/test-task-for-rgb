import { ApiProperty } from "@nestjs/swagger";

export class PaginationMetaDto {
  @ApiProperty({ example: 1, description: "Current page number" })
  page!: number;

  @ApiProperty({ example: 10, description: "Page size" })
  limit!: number;

  @ApiProperty({ example: 24, description: "Total number of items" })
  total!: number;

  @ApiProperty({ example: 3, description: "Total number of pages" })
  totalPages!: number;
}
