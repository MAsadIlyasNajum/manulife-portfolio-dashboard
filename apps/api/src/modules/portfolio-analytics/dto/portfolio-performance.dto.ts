import { ApiProperty } from '@nestjs/swagger';

export class PortfolioPerformanceItemDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    investmentId: string;

    @ApiProperty({ example: 'Apple Inc' })
    name: string;

    @ApiProperty({ example: 20000 })
    totalBuyValue: number;

    @ApiProperty({ example: 5000 })
    totalSellValue: number;

    @ApiProperty({ example: 15000 })
    netFlow: number;
}

export class PortfolioPerformanceDto {
    @ApiProperty({ type: [PortfolioPerformanceItemDto] })
    performance: PortfolioPerformanceItemDto[];
}