import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TransactionType } from '@prisma/client';

import { PrismaService } from '../common/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { TransactionsListResult } from './interfaces/transactions-list-result.interface';

const transactionSelect = {
  id: true,
  investmentId: true,
  type: true,
  quantity: true,
  price: true,
  transactionDate: true,
  createdAt: true,
} satisfies Prisma.TransactionSelect;

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(
    userId: string,
    investmentId: string,
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    await this.ensureOwnedInvestment(userId, investmentId);

    if (createTransactionDto.type === TransactionType.SELL) {
      const availableQuantity = await this.getAvailableQuantity(investmentId);
      if (createTransactionDto.quantity > availableQuantity) {
        throw new BadRequestException('Insufficient quantity for SELL transaction');
      }
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        investmentId,
        type: createTransactionDto.type,
        quantity: createTransactionDto.quantity,
        price: createTransactionDto.price,
        transactionDate: createTransactionDto.transactionDate,
      },
      select: transactionSelect,
    });

    return this.toResponseDto(transaction);
  }

  async findAllByInvestment(
    userId: string,
    investmentId: string,
    page = 1,
    limit = 10,
  ): Promise<TransactionsListResult> {
    await this.ensureOwnedInvestment(userId, investmentId);

    const safePage = page < 1 ? 1 : page;
    const safeLimit = limit < 1 ? 10 : limit;
    const skip = (safePage - 1) * safeLimit;

    const [total, transactions] = await this.prisma.$transaction([
      this.prisma.transaction.count({ where: { investmentId } }),
      this.prisma.transaction.findMany({
        where: { investmentId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: safeLimit,
        select: transactionSelect,
      }),
    ]);

    return {
      data: transactions.map((transaction) => this.toResponseDto(transaction)),
      meta: {
        page: safePage,
        limit: safeLimit,
        total,
      },
    };
  }

  async findOne(userId: string, id: string): Promise<TransactionResponseDto> {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id,
        investment: {
          portfolio: {
            userId,
          },
        },
      },
      select: transactionSelect,
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return this.toResponseDto(transaction);
  }

  private async ensureOwnedInvestment(userId: string, investmentId: string) {
    const investment = await this.prisma.investment.findFirst({
      where: {
        id: investmentId,
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

  private async getAvailableQuantity(investmentId: string): Promise<number> {
    const grouped = await this.prisma.transaction.groupBy({
      by: ['type'],
      where: { investmentId },
      _sum: { quantity: true },
    });

    let buys = 0;
    let sells = 0;

    for (const row of grouped) {
      const value = Number(row._sum.quantity ?? 0);
      if (row.type === TransactionType.BUY) {
        buys = value;
      }
      if (row.type === TransactionType.SELL) {
        sells = value;
      }
    }

    return buys - sells;
  }

  private toResponseDto(transaction: {
    id: string;
    investmentId: string;
    type: TransactionType;
    quantity: Prisma.Decimal;
    price: Prisma.Decimal;
    transactionDate: Date;
    createdAt: Date;
  }): TransactionResponseDto {
    return {
      id: transaction.id,
      investmentId: transaction.investmentId,
      type: transaction.type,
      quantity: transaction.quantity.toString(),
      price: transaction.price.toString(),
      transactionDate: transaction.transactionDate.toISOString(),
      createdAt: transaction.createdAt.toISOString(),
    };
  }
}
