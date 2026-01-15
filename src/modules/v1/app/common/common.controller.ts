import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { JwtAccessGuard } from 'src/common/guards/jwt-access.guard';
import { CommonService } from './common.service';

@ApiTags('APP - Common')
@Controller()
@ApiBearerAuth('JwtAccess')
@UseGuards(JwtAccessGuard)
export class CommonController {
  constructor(
    @Inject(CommonService)
    private readonly commonService: CommonService,
  ) {}

  /**
   * Get Common Module Info
   * Returns information about the common module
   */
  @Get()
  @ApiOperation({
    summary: 'Get Common Module Info',
    description: 'Returns information about the common module. Requires authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Common module info retrieved successfully',
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
  async getCommonInfo(): Promise<string> {
    return this.commonService.getCommonInfo();
  }
}
