import { Body, Controller, Delete, Get, Param, Patch, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { DealStatus } from "@prisma/client";

import { DealsService } from "./deals.service";
import { CreateDealDto } from "./dto/create-deal.dto";
import { DealWithClientDto } from "./dto/deal-with-client.dto";
import { ListDealsQueryDto } from "./dto/list-deals-query.dto";
import { UpdateDealDto } from "./dto/update-deal.dto";

@ApiTags("deals")
@Controller("deals")
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Get()
  @ApiOperation({ summary: "Get filtered deals" })
  @ApiQuery({ name: "status", required: false, enum: DealStatus })
  @ApiQuery({ name: "clientId", required: false, example: "0d3c4f66-2b1a-4c1c-9e48-5bbf0b9a4d11" })
  @ApiOkResponse({ type: DealWithClientDto, isArray: true })
  findAll(@Query() query: ListDealsQueryDto) {
    return this.dealsService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get deal with client" })
  @ApiOkResponse({ type: DealWithClientDto })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.dealsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create deal" })
  @ApiCreatedResponse({ type: DealWithClientDto })
  create(@Body() createDealDto: CreateDealDto) {
    return this.dealsService.create(createDealDto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update deal" })
  @ApiOkResponse({ type: DealWithClientDto })
  update(@Param("id", ParseUUIDPipe) id: string, @Body() updateDealDto: UpdateDealDto) {
    return this.dealsService.update(id, updateDealDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete deal" })
  @ApiOkResponse({ type: DealWithClientDto })
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.dealsService.remove(id);
  }
}
