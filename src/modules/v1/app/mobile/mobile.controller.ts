import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { JwtAccessGuard } from 'src/common/guards/jwt-access.guard';
import { MobileService } from './mobile.service';

@ApiTags('APP - Mobile')
@Controller()
@ApiBearerAuth('JwtAccess')
@UseGuards(JwtAccessGuard)
export class MobileController {
  constructor(
    @Inject(MobileService)
    private readonly mobileService: MobileService,
  ) {}

  /**
   * Get Mobile Module Info
   * Returns information about the mobile module
   */
  @Get()
  @ApiOperation({
    summary: 'Get Mobile Module Info',
    description: 'Returns information about the mobile module. Requires authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Mobile module info retrieved successfully',
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
  async getMobileInfo(): Promise<string> {
    return this.mobileService.getMobileInfo();
  }
}
