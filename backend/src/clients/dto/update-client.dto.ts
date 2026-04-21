import { IsEmail, IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateClientDto {
  @ApiPropertyOptional({ example: "Acme Inc", description: "Client name" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: "hello@acme.com", description: "Unique client email" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: "+380501112233", description: "Optional phone number" })
  @IsOptional()
  @IsString()
  phone?: string | null;
}
