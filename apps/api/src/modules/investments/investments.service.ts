import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetType, Prisma } from '@prisma/client';

import { PrismaService } from '../common/prisma.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { InvestmentResponseDto } from './dto/investment-response.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { InvestmentsListResult } from './interfaces/investments-list-result.interface';

const investmentSelect = {
  id: true,
  portfolioId: true,
  name: true,
  assetType: true,
  quantity: true,
  purchasePrice: true,
  currentPrice: true,
  createdAt: true,
} satisfies Prisma.InvestmentSelect;

@Injectable()
export class InvestmentsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(
    userId: string,
    portfolioId: string,
    createInvestmentDto: CreateInvestmentDto,
  ): Promise<InvestmentResponseDto> {
    await this.ensureOwnedPortfolio(userId, portfolioId);

    const investment = await this.prisma.investment.create({
      data: {
        portfolioId,
        name: createInvestmentDto.name,
        assetType: createInvestmentDto.assetType as AssetType,
        quantity: createInvestmentDto.quantity,
        purchasePrice: createInvestmentDto.purchasePrice,
        currentPrice: createInvestmentDto.currentPrice,
      },
      select: investmentSelect,
    });

    return this.toResponseDto(investment);
  }

  async findAllByPortfolio(
    userId: string,
    portfolioId: string,
    page = 1,
    limit = 10,
  ): Promise<InvestmentsListResult> {
    await this.ensureOwnedPortfolio(userId, portfolioId);

    const safePage = page < 1 ? 1 : page;
    const safeLimit = limit < 1 ? 10 : limit;
    const skip = (safePage - 1) * safeLimit;

    const [total, investments] = await this.prisma.$transaction([
      this.prisma.investment.count({ where: { portfolioId } }),
      this.prisma.investment.findMany({
        where: { portfolioId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: safeLimit,
        select: investmentSelect,
      }),
    ]);

    return {
      data: investments.map((investment) => this.toResponseDto(investment)),
      meta: {
        page: safePage,
        limit: safeLimit,
        total,
      },
    };
  }

  async findOne(userId: string, id: string): Promise<InvestmentResponseDto> {
    const investment = await this.prisma.investment.findFirst({
      where: {
        id,
        portfolio: {
          userId,
        },
      },
      select: investmentSelect,
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    return this.toResponseDto(investment);
  }

  async update(userId: string, id: string, updateInvestmentDto: UpdateInvestmentDto): Promise<InvestmentResponseDto> {
    await this.ensureOwnedInvestment(userId, id);

    if (updateInvestmentDto.portfolioId) {
      await this.ensureOwnedPortfolio(userId, updateInvestmentDto.portfolioId);
    }

    const investment = await this.prisma.investment.update({
      where: { id },
      data: {
        ...(updateInvestmentDto.portfolioId !== undefined ? { portfolioId: updateInvestmentDto.portfolioId } : {}),
        ...(updateInvestmentDto.name !== undefined ? { name: updateInvestmentDto.name } : {}),
        ...(updateInvestmentDto.assetType !== undefined ? { assetType: updateInvestmentDto.assetType as AssetType } : {}),
        ...(updateInvestmentDto.quantity !== undefined ? { quantity: updateInvestmentDto.quantity } : {}),
        ...(updateInvestmentDto.purchasePrice !== undefined ? { purchasePrice: updateInvestmentDto.purchasePrice } : {}),
        ...(updateInvestmentDto.currentPrice !== undefined ? { currentPrice: updateInvestmentDto.currentPrice } : {}),
      },
      select: investmentSelect,
    });

    return this.toResponseDto(investment);
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.ensureOwnedInvestment(userId, id);

    await this.prisma.investment.delete({
      where: { id },
    });
  }

  private async ensureOwnedPortfolio(userId: string, portfolioId: string) {
    const portfolio = await this.prisma.portfolio.findFirst({
      where: { id: portfolioId, userId },
      select: { id: true },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }
  }

  private async ensureOwnedInvestment(userId: string, id: string) {
    const investment = await this.prisma.investment.findFirst({
      where: {
        id,
        portfolio: {
          userId,
        },
      },
      select: { id: true },
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }
  }

  private toResponseDto(investment: {
    id: string;
    portfolioId: string;
    name: string;
    assetType: AssetType;
    quantity: Prisma.Decimal;
    purchasePrice: Prisma.Decimal;
    currentPrice: Prisma.Decimal;
    createdAt: Date;
  }): InvestmentResponseDto {
    return {
      id: investment.id,
      portfolioId: investment.portfolioId,
      name: investment.name,
      assetType: investment.assetType,
      quantity: investment.quantity.toString(),
      purchasePrice: investment.purchasePrice.toString(),
      currentPrice: investment.currentPrice.toString(),
      createdAt: investment.createdAt.toISOString(),
    };
  }
}
