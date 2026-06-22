import { apiClient } from '../http-client';

export interface DashboardSummary {
    totalInvested: number;
    currentValue: number;
    totalGainLoss: number;
    gainLossPercentage: number;
}

export interface AllocationItem {
    investmentId: string;
    name: string;
    value: number;
    percentage: number;
}

export interface AllocationResponse {
    allocations: AllocationItem[];
}

export interface PerformanceItem {
    investmentId: string;
    name: string;
    totalBuyValue: number;
    totalSellValue: number;
    netFlow: number;
}

export interface PerformanceResponse {
    performance: PerformanceItem[];
}

export const analyticsService = {
    async getSummary(portfolioId: string): Promise<DashboardSummary> {
        const { data } = await apiClient.get<DashboardSummary>(`/portfolios/${portfolioId}/summary`);
        return data;
    },

    async getAllocation(portfolioId: string): Promise<AllocationResponse> {
        const { data } = await apiClient.get<AllocationResponse>(`/portfolios/${portfolioId}/allocation`);
        return data;
    },

    async getPerformance(portfolioId: string): Promise<PerformanceResponse> {
        const { data } = await apiClient.get<PerformanceResponse>(`/portfolios/${portfolioId}/performance`);
        return data;
    },
};
