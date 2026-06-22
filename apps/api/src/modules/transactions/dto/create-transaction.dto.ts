import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsPositive } from 'class-validator';

export class CreateTransactionDto {
    @ApiProperty({
        description: 'Transaction type',
        enum: TransactionType,
        example: TransactionType.BUY,
    })
    @IsEnum(TransactionType)
    type: TransactionType;

    @ApiProperty({
        description: 'Transaction quantity',
        example: 10,
    })
    @Type(() => Number)
    @IsNumber({ allowInfinity: false, allowNaN: false })
    @IsPositive()
    quantity: number;

    @ApiProperty({
        description: 'Unit price',
        example: 175,
    })
    @Type(() => Number)
    @IsNumber({ allowInfinity: false, allowNaN: false })
    @IsPositive()
    price: number;

    @ApiProperty({
        description: 'Transaction date in ISO-8601 format',
        example: '2026-06-17T10:00:00.000Z',
        format: 'date-time',
    })
    @IsDateString()
    transactionDate: string;
}