import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { DashboardPage } from './DashboardPage';

vi.mock('react-i18next', () => ({
    initReactI18next: {
        type: '3rdParty',
        init: () => undefined,
    },
    useTranslation: () => ({
        t: (key: string, options?: { name?: string }) => {
            const dictionary: Record<string, string> = {
                'dashboard.title': 'Dashboard',
                'dashboard.subtitleWithName': `${options?.name ?? ''} portfolio overview`,
                'dashboard.subtitleLoading': 'Loading portfolio overview',
                'dashboard.errors.loadDashboard': 'Unable to load dashboard.',
                'dashboard.empty.noPortfolio': 'No portfolio data is available for this account yet.',
            };

            return dictionary[key] ?? key;
        },
        i18n: { language: 'en' },
    }),
}));

vi.mock('@mui/material', () => ({
    Alert: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Box: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Stack: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Typography: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('../components/dashboard/AllocationChart', () => ({
    AllocationChart: () => <div>Allocation chart</div>,
}));

vi.mock('../components/dashboard/PerformanceTable', () => ({
    PerformanceTable: () => <div>Performance table</div>,
}));

vi.mock('../components/dashboard/SummaryCard', () => ({
    SummaryCard: ({ title, value }: { title: string; value: string }) => (
        <div>
            <span>{title}</span>
            <span>{value}</span>
        </div>
    ),
}));

vi.mock('../components/dashboard/TransactionsList', () => ({
    TransactionsList: () => <div>Transactions list</div>,
}));

vi.mock('../hooks/use-dashboard-data', () => ({
    useDashboardData: () => ({
        portfolio: { id: 'portfolio-1', name: 'Manulife Growth', description: null },
        portfoliosQuery: { error: null, isLoading: false },
        summaryQuery: {
            data: {
                totalInvested: 10000,
                currentValue: 10800,
                totalGainLoss: 800,
                gainLossPercentage: 8,
            },
            isLoading: false,
        },
        allocationQuery: { isLoading: false, error: null },
        performanceQuery: { isLoading: false, error: null },
        transactionsLoading: false,
        transactionsError: null,
        allocationItems: [],
        performanceItems: [],
        recentTransactions: [],
    }),
}));

describe('DashboardPage', () => {
    it('renders dashboard overview content', () => {
        render(<DashboardPage />);

        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Manulife Growth portfolio overview')).toBeInTheDocument();
        expect(screen.getByText('Allocation chart')).toBeInTheDocument();
        expect(screen.getByText('Transactions list')).toBeInTheDocument();
        expect(screen.getByText('Performance table')).toBeInTheDocument();
    });
});