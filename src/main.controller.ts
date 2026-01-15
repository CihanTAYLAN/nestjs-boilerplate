import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MainService } from './main.service';
import { Public } from './common/decorators/public.decorator';
import { ApiResponseDto } from './common/dto/api-response.dto';
import { HealthResponseDto } from './common/dto/health-response.dto';

@ApiTags('Health')
@Controller()
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint', tags: ['Health'] })
  @ApiResponse({
    status: 200,
    description: 'Health check response',
    example: ApiResponseDto.getGenericResponseType(HealthResponseDto, false),
    type: ApiResponseDto.getGenericResponseType(HealthResponseDto, false),
  })
  getHealth() {
    return this.mainService.getHealth();
  }
}
