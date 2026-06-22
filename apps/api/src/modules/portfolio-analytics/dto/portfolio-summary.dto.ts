import { ApiProperty } from '@nestjs/swagger';

export class PortfolioSummaryDto {
    @ApiProperty({ example: 25000 })
    totalInvested: number;

    @ApiProperty({ example: 28250 })
    currentValue: number;

    @ApiProperty({ example: 3250 })
    totalGainLoss: number;

    @ApiProperty({ example: 13 })
    gainLossPercentage: number;
}