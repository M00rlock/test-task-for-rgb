import {
  Body,
  Controller,
  Delete,
  DefaultValuePipe,
  Get,
  Param,
  Patch,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query
} from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";

@ApiTags("clients")
@Controller("clients")
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: "Get paginated clients" })
  @ApiQuery({ name: "page", required: false, example: 1 })
  @ApiQuery({ name: "limit", required: false, example: 10 })
  @ApiResponse({ status: 200, description: "Paginated clients list" })
  findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return this.clientsService.findAll({
      page,
      limit
    });
  }

  @Get(":id")
  @ApiOperation({ summary: "Get client with deals" })
  @ApiResponse({ status: 200, description: "Client with related deals" })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.clientsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create client" })
  @ApiResponse({ status: 201, description: "Client created" })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update client" })
  @ApiResponse({ status: 200, description: "Client updated" })
  update(@Param("id", ParseUUIDPipe) id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete client and cascade deals" })
  @ApiResponse({ status: 200, description: "Client deleted" })
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.clientsService.remove(id);
  }
}
