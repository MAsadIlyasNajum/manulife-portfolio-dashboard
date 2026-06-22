import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../common/prisma.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { PortfolioResponseDto } from './dto/portfolio-response.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PortfolioListResult } from './interfaces/portfolio-list-result.interface';

const portfolioSelect = {
  id: true,
  name: true,
  createdAt: true,
} satisfies Prisma.PortfolioSelect;

@Injectable()
export class PortfoliosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createPortfolioDto: CreatePortfolioDto): Promise<PortfolioResponseDto> {
    const portfolio = await this.prisma.portfolio.create({
      data: {
        userId,
        name: createPortfolioDto.name,
      },
      select: portfolioSelect,
    });

    return this.toResponseDto(portfolio);
  }

  async findAll(userId: string, page = 1, limit = 10): Promise<PortfolioListResult> {
    const safePage = page < 1 ? 1 : page;
    const safeLimit = limit < 1 ? 10 : limit;
    const skip = (safePage - 1) * safeLimit;

    const [total, portfolios] = await this.prisma.$transaction([
      this.prisma.portfolio.count({ where: { userId } }),
      this.prisma.portfolio.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: safeLimit,
        select: portfolioSelect,
      }),
    ]);

    return {
      data: portfolios.map((portfolio) => this.toResponseDto(portfolio)),
      meta: {
        page: safePage,
        limit: safeLimit,
        total,
      },
    };
  }

  async findOne(userId: string, id: string): Promise<PortfolioResponseDto> {
    const portfolio = await this.prisma.portfolio.findFirst({
      where: { id, userId },
      select: portfolioSelect,
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    return this.toResponseDto(portfolio);
  }

  async update(userId: string, id: string, updatePortfolioDto: UpdatePortfolioDto): Promise<PortfolioResponseDto> {
    await this.ensureOwnedPortfolio(userId, id);

    const portfolio = await this.prisma.portfolio.update({
      where: { id },
      data: {
        ...(updatePortfolioDto.name !== undefined ? { name: updatePortfolioDto.name } : {}),
      },
      select: portfolioSelect,
    });

    return this.toResponseDto(portfolio);
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.ensureOwnedPortfolio(userId, id);

    await this.prisma.portfolio.delete({
      where: { id },
    });
  }

  private async ensureOwnedPortfolio(userId: string, id: string) {
    const portfolio = await this.prisma.portfolio.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }
  }

  private toResponseDto(portfolio: { id: string; name: string; createdAt: Date }): PortfolioResponseDto {
    return {
      id: portfolio.id,
      name: portfolio.name,
      createdAt: portfolio.createdAt.toISOString(),
    };
  }
}
