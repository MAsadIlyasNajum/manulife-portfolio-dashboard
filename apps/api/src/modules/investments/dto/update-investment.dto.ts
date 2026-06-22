import { ApiPropertyOptional } from '@nestjs/swagger';
import { AssetType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    IsUUID,
    MaxLength,
    MinLength,
} from 'class-validator';

export class UpdateInvestmentDto {
    @ApiPropertyOptional({
        description: 'Target portfolio id when moving investment between owned portfolios',
        example: '550e8400-e29b-41d4-a716-446655440001',
    })
    @IsOptional()
    @IsUUID()
    portfolioId?: string;

    @ApiPropertyOptional({
        description: 'Investment name',
        example: 'Apple Inc Class A',
        minLength: 2,
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name?: string;

    @ApiPropertyOptional({
        description: 'Asset type',
        enum: AssetType,
        example: AssetType.STOCK,
    })
    @IsOptional()
    @IsEnum(AssetType)
    assetType?: AssetType;

    @ApiPropertyOptional({
        description: 'Quantity held',
        example: 120,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @IsPositive()
    quantity?: number;

    @ApiPropertyOptional({
        description: 'Purchase price per unit',
        example: 155,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @IsPositive()
    purchasePrice?: number;

    @ApiPropertyOptional({
        description: 'Current price per unit',
        example: 180,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @IsPositive()
    currentPrice?: number;
}