import { ApiProperty } from "@nestjs/swagger";

export class HealthResponseDto {
  @ApiProperty({ example: "ok" })
  status!: string;

  @ApiProperty({ example: "backend" })
  service!: string;

  @ApiProperty({ type: String, example: "2026-04-21T10:56:41.192Z" })
  timestamp!: string;
}
