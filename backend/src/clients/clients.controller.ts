import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  ParseUUIDPipe,
  Post,
  Query
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags
} from "@nestjs/swagger";

import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { ClientWithDealsDto } from "./dto/client-with-deals.dto";
import { ListClientsQueryDto } from "./dto/list-clients-query.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { ClientSummaryDto } from "./dto/client-summary.dto";
import { PaginatedClientsResponseDto } from "./dto/paginated-clients-response.dto";

@ApiTags("clients")
@Controller("clients")
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: "Get paginated clients" })
  @ApiQuery({ name: "page", required: false, example: 1 })
  @ApiQuery({ name: "limit", required: false, example: 10 })
  @ApiOkResponse({ type: PaginatedClientsResponseDto })
  findAll(@Query() query: ListClientsQueryDto) {
    return this.clientsService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get client with deals" })
  @ApiOkResponse({ type: ClientWithDealsDto })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.clientsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create client" })
  @ApiCreatedResponse({ type: ClientSummaryDto })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update client" })
  @ApiOkResponse({ type: ClientSummaryDto })
  update(@Param("id", ParseUUIDPipe) id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete client and cascade deals" })
  @ApiOkResponse({ type: ClientSummaryDto })
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.clientsService.remove(id);
  }
}
