import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { AppService } from "./app.service";
import { HealthResponseDto } from "./common/dto/health-response.dto";

@ApiTags("health")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("health")
  @ApiOkResponse({ type: HealthResponseDto })
  getHealth() {
    return this.appService.getHealth();
  }
}
