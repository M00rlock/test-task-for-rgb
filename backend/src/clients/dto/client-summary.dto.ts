import { ApiProperty } from "@nestjs/swagger";

export class ClientSummaryDto {
  @ApiProperty({ format: "uuid", example: "8eb9d544-eadf-499a-9815-31645349d1cf" })
  id!: string;

  @ApiProperty({ example: "Acme Inc" })
  name!: string;

  @ApiProperty({ example: "hello@acme.com" })
  email!: string;

  @ApiProperty({ example: null, nullable: true })
  phone!: string | null;

  @ApiProperty({ type: String, example: "2026-04-21T10:56:41.192Z" })
  createdAt!: Date;

  @ApiProperty({ type: String, example: "2026-04-21T10:56:41.192Z" })
  updatedAt!: Date;
}
