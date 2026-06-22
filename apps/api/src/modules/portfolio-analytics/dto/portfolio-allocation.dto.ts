import { ApiProperty } from '@nestjs/swagger';

export class PortfolioAllocationItemDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    investmentId: string;

    @ApiProperty({ example: 'Apple Inc' })
    name: string;

    @ApiProperty({ example: 12500 })
    value: number;

    @ApiProperty({ example: 52.63 })
    percentage: number;
}

export class PortfolioAllocationDto {
    @ApiProperty({ type: [PortfolioAllocationItemDto] })
    allocations: PortfolioAllocationItemDto[];
}