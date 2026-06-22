import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

export class TransactionResponseDto {
    @ApiProperty({
        description: 'Transaction unique identifier',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    id: string;

    @ApiProperty({
        description: 'Investment identifier',
        example: '550e8400-e29b-41d4-a716-446655440001',
    })
    investmentId: string;

    @ApiProperty({
        description: 'Transaction type',
        enum: TransactionType,
        example: TransactionType.BUY,
    })
    type: TransactionType;

    @ApiProperty({
        description: 'Transaction quantity',
        example: '10',
    })
    quantity: string;

    @ApiProperty({
        description: 'Transaction price',
        example: '175',
    })
    price: string;

    @ApiProperty({
        description: 'Transaction date',
        example: '2026-06-17T10:00:00.000Z',
        format: 'date-time',
    })
    transactionDate: string;

    @ApiProperty({
        description: 'Created timestamp',
        example: '2026-06-17T10:00:00.000Z',
        format: 'date-time',
    })
    createdAt: string;
}