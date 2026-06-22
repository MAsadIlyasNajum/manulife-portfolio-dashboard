import { useQueries, useQuery } from '@tanstack/react-query';

import { analyticsService } from '../api/services/analytics.service';
import { investmentService } from '../api/services/investment.service';
import { portfolioService } from '../api/services/portfolio.service';
import { transactionService } from '../api/services/transaction.service';

type PortfolioListResponse = Awaited<ReturnType<typeof portfolioService.list>>;
type PortfolioItem = PortfolioListResponse['data'][number];
type InvestmentListResponse = Awaited<ReturnType<typeof investmentService.listByPortfolio>>;
type InvestmentItem = InvestmentListResponse['data'][number];
type AllocationResponse = Awaited<ReturnType<typeof analyticsService.getAllocation>>;
type PerformanceResponse = Awaited<ReturnType<typeof analyticsService.getPerformance>>;
type TransactionPage = Awaited<ReturnType<typeof transactionService.listByInvestment>>;
type TransactionItem = TransactionPage['data'][number];

export interface RecentTransactionItem extends TransactionItem {
    investmentName: string;
}

export function useDashboardData() {
    const portfoliosQuery = useQuery({
        queryKey: ['dashboard', 'portfolios'],
        queryFn: () => portfolioService.list({ page: 1, limit: 25 }),
    });

    const portfolio = portfoliosQuery.data?.data[0] ?? null;
    const portfolioId = portfolio?.id;

    const summaryQuery = useQuery({
        queryKey: ['dashboard', 'summary', portfolioId],
        queryFn: () => analyticsService.getSummary(portfolioId as string),
        enabled: Boolean(portfolioId),
    });

    const allocationQuery = useQuery({
        queryKey: ['dashboard', 'allocation', portfolioId],
        queryFn: () => analyticsService.getAllocation(portfolioId as string),
        enabled: Boolean(portfolioId),
    });

    const performanceQuery = useQuery({
        queryKey: ['dashboard', 'performance', portfolioId],
        queryFn: () => analyticsService.getPerformance(portfolioId as string),
        enabled: Boolean(portfolioId),
    });

    const investmentsQuery = useQuery({
        queryKey: ['dashboard', 'investments', portfolioId],
        queryFn: () => investmentService.listByPortfolio(portfolioId as string, { page: 1, limit: 100 }),
        enabled: Boolean(portfolioId),
    });

    const investments = investmentsQuery.data?.data ?? [];

    const transactionQueries = useQueries({
        queries: investments.map((investment) => ({
            queryKey: ['dashboard', 'transactions', investment.id],
            queryFn: () => transactionService.listByInvestment(investment.id, { page: 1, limit: 10 }),
            enabled: Boolean(portfolioId),
        })),
    });

    const recentTransactions = transactionQueries
        .flatMap((query, index) => {
            const investment = investments[index];
            const rows = query.data?.data ?? [];

            return rows.map((transaction) => ({
                ...transaction,
                investmentName: investment?.name ?? '',
            }));
        })
        .sort(
            (left, right) =>
                new Date(right.transactionDate).getTime() - new Date(left.transactionDate).getTime()
        )
        .slice(0, 8);

    const transactionsError = transactionQueries.find((query) => query.error)?.error ?? null;
    const transactionsLoading = investmentsQuery.isLoading || transactionQueries.some((query) => query.isLoading);

    return {
        portfolio,
        portfoliosQuery,
        summaryQuery,
        allocationQuery,
        performanceQuery,
        investmentsQuery,
        transactionsLoading,
        transactionsError,
        allocationItems: (allocationQuery.data as AllocationResponse | undefined)?.allocations ?? [],
        performanceItems: (performanceQuery.data as PerformanceResponse | undefined)?.performance ?? [],
        recentTransactions,
    };
}