import { ApiProperty } from '@nestjs/swagger';

export class PortfolioResponseDto {
  @ApiProperty({
    description: 'Portfolio unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Portfolio name',
    example: 'Retirement Portfolio',
  })
  name: string;

  @ApiProperty({
    description: 'Portfolio creation timestamp',
    example: '2026-06-17T10:00:00.000Z',
    format: 'date-time',
  })
  createdAt: string;
}