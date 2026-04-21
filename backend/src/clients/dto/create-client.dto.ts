import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateClientDto {
  @ApiProperty({ example: "Acme Inc", description: "Client name" })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: "hello@acme.com", description: "Unique client email" })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: "+380501112233", description: "Optional phone number" })
  @IsOptional()
  @IsString()
  phone?: string;
}
