import { ApiProperty } from '@nestjs/swagger';
import { AssetType } from '@prisma/client';

export class InvestmentResponseDto {
    @ApiProperty({
        description: 'Investment unique identifier',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    id: string;

    @ApiProperty({
        description: 'Owning portfolio identifier',
        example: '550e8400-e29b-41d4-a716-446655440001',
    })
    portfolioId: string;

    @ApiProperty({
        description: 'Investment name',
        example: 'Apple Inc',
    })
    name: string;

    @ApiProperty({
        description: 'Asset type',
        enum: AssetType,
        example: AssetType.STOCK,
    })
    assetType: AssetType;

    @ApiProperty({
        description: 'Quantity held',
        example: '100',
    })
    quantity: string;

    @ApiProperty({
        description: 'Purchase price per unit',
        example: '150',
    })
    purchasePrice: string;

    @ApiProperty({
        description: 'Current price per unit',
        example: '175',
    })
    currentPrice: string;

    @ApiProperty({
        description: 'Investment creation timestamp',
        example: '2026-06-17T10:00:00.000Z',
        format: 'date-time',
    })
    createdAt: string;
}