import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { JwtAccessGuard } from 'src/common/guards/jwt-access.guard';
import { SystemListVariablesService } from './system-list-variables.service';

@ApiTags('COMMON - System List Variables')
@Controller()
@ApiBearerAuth('JwtAccess')
export class SystemListVariablesController {
  constructor(
    @Inject(SystemListVariablesService)
    private readonly systemListVariablesService: SystemListVariablesService,
  ) {}

  /**
   * Get All Example Enum List
   * Returns list of all example enum list for frontend select boxes
   */
  @UseGuards(JwtAccessGuard)
  @Get('example-enum-list')
  @ApiOperation({
    summary: 'Get Example Enum List',
    description:
      'Retrieve list of all example enum list from the database for frontend select boxes. Requires authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Example enum list retrieved successfully',
    type: ApiResponseDto.getGenericResponseType(Object, true),
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Valid JWT token required',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getExampleEnumList(): Promise<any[]> {
    const exampleEnumList =
      await this.systemListVariablesService.getExampleEnumList();
    return exampleEnumList;
  }
}
