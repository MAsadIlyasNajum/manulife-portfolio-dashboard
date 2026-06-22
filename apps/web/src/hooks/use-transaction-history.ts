import { useMemo } from 'react';
import type { AssetType, TransactionDto } from '@portfolio/shared-types';
import { useQuery } from '@tanstack/react-query';

import { investmentService } from '../api/services/investment.service';
import { transactionService } from '../api/services/transaction.service';

interface InvestmentReference {
    id: string;
    name: string;
    assetType: AssetType;
}

export interface TransactionHistoryItem extends TransactionDto {
    investmentName: string;
    assetType: AssetType;
    totalValue: number;
}

const TRANSACTION_PAGE_LIMIT = 100;

async function listAllTransactionsByInvestment(investmentId: string): Promise<TransactionDto[]> {
    const firstPage = await transactionService.listByInvestment(investmentId, {
        page: 1,
        limit: TRANSACTION_PAGE_LIMIT,
    });

    const totalPages = Math.ceil(firstPage.meta.total / TRANSACTION_PAGE_LIMIT);

    if (totalPages <= 1) {
        return firstPage.data;
    }

    const remainingPages = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, index) =>
            transactionService.listByInvestment(investmentId, {
                page: index + 2,
                limit: TRANSACTION_PAGE_LIMIT,
            })
        )
    );

    return [...firstPage.data, ...remainingPages.flatMap((response) => response.data)];
}

export function useTransactionHistory(portfolioId: string) {
    const investmentsQuery = useQuery({
        queryKey: ['transactions', 'investments', portfolioId],
        queryFn: () => investmentService.listByPortfolio(portfolioId, { page: 1, limit: 100 }),
        enabled: Boolean(portfolioId),
    });

    const investments: InvestmentReference[] = useMemo(
        () =>
            (investmentsQuery.data?.data ?? []).map((investment) => ({
                id: investment.id,
                name: investment.name,
                assetType: investment.assetType,
            })),
        [investmentsQuery.data]
    );

    const transactionsQuery = useQuery({
        queryKey: ['transactions', 'history', portfolioId, investments.map((item) => item.id).join('|')],
        enabled: Boolean(portfolioId) && !investmentsQuery.isLoading,
        queryFn: async (): Promise<TransactionHistoryItem[]> => {
            if (investments.length === 0) {
                return [];
            }

            const transactionsByInvestment = await Promise.all(
                investments.map(async (investment) => {
                    const rows = await listAllTransactionsByInvestment(investment.id);

                    return rows.map((transaction) => {
                        const quantity = Number(transaction.quantity);
                        const price = Number(transaction.price);

                        return {
                            ...transaction,
                            quantity,
                            price,
                            investmentName: investment.name,
                            assetType: investment.assetType,
                            totalValue: quantity * price,
                        };
                    });
                })
            );

            return transactionsByInvestment
                .flat()
                .sort(
                    (left, right) =>
                        new Date(right.transactionDate).getTime() - new Date(left.transactionDate).getTime()
                );
        },
    });

    return {
        investmentsQuery,
        transactionsQuery,
        loading: investmentsQuery.isLoading || transactionsQuery.isLoading,
        error: investmentsQuery.error ?? transactionsQuery.error,
        items: transactionsQuery.data ?? [],
    };
}
