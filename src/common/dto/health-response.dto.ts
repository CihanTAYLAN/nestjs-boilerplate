import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({
    example: 'ok',
    description: 'Health status',
  })
  status: string;

  @ApiProperty({
    example: '2024-01-08T15:30:00.000Z',
    description: 'Current timestamp',
  })
  timestamp: string;

  @ApiProperty({
    example: 'nestjs-boilerplate',
    description: 'Service name',
  })
  service: string;
}
