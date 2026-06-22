import { ApiProperty } from '@nestjs/swagger';
import { AssetType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateInvestmentDto {
    @ApiProperty({
        description: 'Investment name',
        example: 'Apple Inc',
        minLength: 2,
        maxLength: 100,
    })
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @ApiProperty({
        description: 'Asset type',
        enum: AssetType,
        example: AssetType.STOCK,
    })
    @IsEnum(AssetType)
    assetType: AssetType;

    @ApiProperty({
        description: 'Quantity held',
        example: 100,
    })
    @Type(() => Number)
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @IsPositive()
    quantity: number;

    @ApiProperty({
        description: 'Purchase price per unit',
        example: 150,
    })
    @Type(() => Number)
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @IsPositive()
    purchasePrice: number;

    @ApiProperty({
        description: 'Current price per unit',
        example: 175,
    })
    @Type(() => Number)
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @IsPositive()
    currentPrice: number;
}