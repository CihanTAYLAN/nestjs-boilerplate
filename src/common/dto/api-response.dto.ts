import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { FilterMetaResponseDto } from './filter-meta-response.dto';

export class ApiResponseDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ required: false })
  data: T | null;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty({
    required: false,
    example: ['Validation failed', 'Invalid input'],
  })
  details?: string[];

  @ApiProperty({
    description: 'Response timestamp in ISO format',
    example: '2024-01-08T15:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path',
    example: '/api/auth/login',
  })
  path: string;

  @ApiProperty({
    description: 'Response time in milliseconds',
    example: 150,
  })
  responseTime: number;

  static getGenericResponseType<T>(type: Type<T> | null, isArray = false) {
    class GenericResponseDto extends ApiResponseDto<T> {
      @ApiProperty(
        type
          ? {
              type: type,
              isArray: isArray,
            }
          : {},
      )
      data: T | null;
    }
    Object.defineProperty(GenericResponseDto, 'name', {
      value: `ApiResponseDto<${type?.name ?? 'void'}${isArray ? '[]' : ''}>`,
    });
    return GenericResponseDto;
  }

  static getPaginationResponseType<T>(type: Type<T>) {
    class PaginationResponseDto extends ApiResponseDto<T[]> {
      @ApiProperty({
        type: type,
        isArray: true,
      })
      data: T[] | null;

      @ApiProperty({
        type: FilterMetaResponseDto,
      })
      meta: FilterMetaResponseDto | null;
    }
    Object.defineProperty(PaginationResponseDto, 'name', {
      value: `PaginationApiResponseDto<${type?.name ?? 'void'}[]>`,
    });
    return PaginationResponseDto;
  }
}
