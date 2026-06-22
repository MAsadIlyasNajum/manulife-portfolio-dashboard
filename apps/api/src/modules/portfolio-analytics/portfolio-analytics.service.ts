import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { PortfolioAllocationDto, PortfolioAllocationItemDto } from './dto/portfolio-allocation.dto';
import { PortfolioPerformanceDto, PortfolioPerformanceItemDto } from './dto/portfolio-performance.dto';
import { PortfolioSummaryDto } from './dto/portfolio-summary.dto';

@Injectable()
export class PortfolioAnalyticsService {
    constructor(private readonly prisma: PrismaService) { }

    async getSummary(userId: string, portfolioId: string): Promise<PortfolioSummaryDto> {
        await this.ensureOwnedPortfolio(userId, portfolioId);

        const [investments, buyByPriceAndInvestment, netQuantityByInvestmentAndType] = await Promise.all([
            this.prisma.investment.findMany({
                where: { portfolioId },
                select: {
                    id: true,
                    currentPrice: true,
                },
            }),
            this.prisma.transaction.groupBy({
                by: ['investmentId', 'price'],
                where: {
                    type: 'BUY',
                    investment: {
                        portfolioId,
                    },
                },
                _sum: {
                    quantity: true,
                },
            }),
            this.prisma.transaction.groupBy({
                by: ['investmentId', 'type'],
                where: {
                    investment: {
                        portfolioId,
                    },
                },
                _sum: {
                    quantity: true,
                },
            }),
        ]);

        let totalInvested = 0;
        for (const row of buyByPriceAndInvestment) {
            const qty = Number(row._sum.quantity ?? 0);
            totalInvested += Number(row.price) * qty;
        }

        const quantityByInvestment = this.buildNetQuantities(netQuantityByInvestmentAndType);

        let currentValue = 0;
        for (const investment of investments) {
            const currentQty = quantityByInvestment.get(investment.id) ?? 0;
            currentValue += Number(investment.currentPrice) * currentQty;
        }

        const totalGainLoss = currentValue - totalInvested;
        const gainLossPercentage = totalInvested === 0 ? 0 : (totalGainLoss / totalInvested) * 100;

        return {
            totalInvested,
            currentValue,
            totalGainLoss,
            gainLossPercentage,
        };
    }

    async getAllocation(userId: string, portfolioId: string): Promise<PortfolioAllocationDto> {
        await this.ensureOwnedPortfolio(userId, portfolioId);

        const [investments, netQuantityByInvestmentAndType] = await Promise.all([
            this.prisma.investment.findMany({
                where: { portfolioId },
                select: {
                    id: true,
                    name: true,
                    currentPrice: true,
                },
            }),
            this.prisma.transaction.groupBy({
                by: ['investmentId', 'type'],
                where: {
                    investment: {
                        portfolioId,
                    },
                },
                _sum: {
                    quantity: true,
                },
            }),
        ]);

        const quantityByInvestment = this.buildNetQuantities(netQuantityByInvestmentAndType);

        const items: PortfolioAllocationItemDto[] = investments.map((investment) => {
            const quantity = quantityByInvestment.get(investment.id) ?? 0;
            const value = quantity * Number(investment.currentPrice);

            return {
                investmentId: investment.id,
                name: investment.name,
                value,
                percentage: 0,
            };
        });

        const totalValue = items.reduce((acc, item) => acc + item.value, 0);
        for (const item of items) {
            item.percentage = totalValue === 0 ? 0 : (item.value / totalValue) * 100;
        }

        return { allocations: items };
    }

    async getPerformance(userId: string, portfolioId: string): Promise<PortfolioPerformanceDto> {
        await this.ensureOwnedPortfolio(userId, portfolioId);

        const [investments, transactionByInvestmentTypePrice] = await Promise.all([
            this.prisma.investment.findMany({
                where: { portfolioId },
                select: {
                    id: true,
                    name: true,
                },
            }),
            this.prisma.transaction.groupBy({
                by: ['investmentId', 'type', 'price'],
                where: {
                    investment: {
                        portfolioId,
                    },
                },
                _sum: {
                    quantity: true,
                },
            }),
        ]);

        const metrics = new Map<string, { buyValue: number; sellValue: number }>();

        for (const row of transactionByInvestmentTypePrice) {
            const quantity = Number(row._sum.quantity ?? 0);
            const amount = quantity * Number(row.price);
            const current = metrics.get(row.investmentId) ?? { buyValue: 0, sellValue: 0 };

            if (row.type === 'BUY') {
                current.buyValue += amount;
            } else {
                current.sellValue += amount;
            }

            metrics.set(row.investmentId, current);
        }

        const performance: PortfolioPerformanceItemDto[] = investments.map((investment) => {
            const item = metrics.get(investment.id) ?? { buyValue: 0, sellValue: 0 };
            return {
                investmentId: investment.id,
                name: investment.name,
                totalBuyValue: item.buyValue,
                totalSellValue: item.sellValue,
                netFlow: item.buyValue - item.sellValue,
            };
        });

        return { performance };
    }

    private async ensureOwnedPortfolio(userId: string, portfolioId: string): Promise<void> {
        const ownedPortfolio = await this.prisma.portfolio.findFirst({
            where: { id: portfolioId, userId },
            select: { id: true },
        });

        if (!ownedPortfolio) {
            throw new NotFoundException('Portfolio not found');
        }
    }

    private buildNetQuantities(
        grouped: Array<{ investmentId: string; type: 'BUY' | 'SELL'; _sum: { quantity: unknown } }>,
    ): Map<string, number> {
        const quantities = new Map<string, number>();

        for (const row of grouped) {
            const current = quantities.get(row.investmentId) ?? 0;
            const amount = Number(row._sum.quantity ?? 0);
            quantities.set(row.investmentId, row.type === 'BUY' ? current + amount : current - amount);
        }

        return quantities;
    }
}