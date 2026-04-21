import { Body, Controller, Delete, Get, Param, Patch, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

import { DealsService } from "./deals.service";
import { CreateDealDto } from "./dto/create-deal.dto";
import { UpdateDealDto } from "./dto/update-deal.dto";

@ApiTags("deals")
@Controller("deals")
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Get()
  @ApiOperation({ summary: "Get filtered deals" })
  @ApiQuery({ name: "status", required: false, enum: ["NEW", "IN_PROGRESS", "WON", "LOST"] })
  @ApiQuery({ name: "clientId", required: false, example: "0d3c4f66-2b1a-4c1c-9e48-5bbf0b9a4d11" })
  @ApiResponse({ status: 200, description: "Filtered deals list" })
  findAll(
    @Query("status") status?: string,
    @Query("clientId", new ParseUUIDPipe({ optional: true })) clientId?: string
  ) {
    return this.dealsService.findAll({
      status,
      clientId
    });
  }

  @Get(":id")
  @ApiOperation({ summary: "Get deal with client" })
  @ApiResponse({ status: 200, description: "Deal with related client" })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.dealsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create deal" })
  @ApiResponse({ status: 201, description: "Deal created" })
  create(@Body() createDealDto: CreateDealDto) {
    return this.dealsService.create(createDealDto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update deal" })
  @ApiResponse({ status: 200, description: "Deal updated" })
  update(@Param("id", ParseUUIDPipe) id: string, @Body() updateDealDto: UpdateDealDto) {
    return this.dealsService.update(id, updateDealDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete deal" })
  @ApiResponse({ status: 200, description: "Deal deleted" })
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.dealsService.remove(id);
  }
}
