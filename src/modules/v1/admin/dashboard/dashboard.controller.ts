import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { JwtAccessGuard } from 'src/common/guards/jwt-access.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('Admin - Dashboard')
@Controller()
@ApiBearerAuth('JwtAccess')
@UseGuards(JwtAccessGuard)
export class DashboardController {
  constructor(
    @Inject(DashboardService)
    private readonly dashboardService: DashboardService,
  ) {}

  /**
   * Get Dashboard Module Info
   * Returns information about the auction module
   */
  @Get()
  @ApiOperation({
    summary: 'Get Dashboard Module Info',
    description: 'Returns information about the auction module. Requires authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard module info retrieved successfully',
    type: ApiResponseDto.getGenericResponseType(String),
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Valid JWT token required',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getDashboardInfo(): Promise<string> {
    return this.dashboardService.getDashboardInfo();
  }
}
