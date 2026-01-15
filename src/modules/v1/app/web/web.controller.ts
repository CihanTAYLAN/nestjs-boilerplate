import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { JwtAccessGuard } from 'src/common/guards/jwt-access.guard';
import { WebService } from './web.service';

@ApiTags('APP - Web')
@Controller()
@ApiBearerAuth('JwtAccess')
@UseGuards(JwtAccessGuard)
export class WebController {
  constructor(
    @Inject(WebService)
    private readonly webService: WebService,
  ) {}

  /**
   * Get Web Module Info
   * Returns information about the web module
   */
  @Get()
  @ApiOperation({
    summary: 'Get Web Module Info',
    description: 'Returns information about the web module. Requires authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Web module info retrieved successfully',
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
  async getWebInfo(): Promise<string> {
    return this.webService.getWebInfo();
  }
}
