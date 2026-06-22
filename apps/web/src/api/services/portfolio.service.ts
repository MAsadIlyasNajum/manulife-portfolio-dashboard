import type { PortfolioDto } from '@portfolio/shared-types';

import { apiClient } from '../http-client';

interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
}

interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

export const portfolioService = {
    async create(payload: { name: string }): Promise<PortfolioDto> {
        const { data } = await apiClient.post<PortfolioDto>('/portfolios', payload);
        return data;
    },

    async list(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<PortfolioDto>> {
        const { data } = await apiClient.get<PaginatedResponse<PortfolioDto>>('/portfolios', {
            params,
        });
        return data;
    },

    async getById(portfolioId: string): Promise<PortfolioDto> {
        const { data } = await apiClient.get<PortfolioDto>(`/portfolios/${portfolioId}`);
        return data;
    },

    async update(portfolioId: string, payload: { name: string }): Promise<PortfolioDto> {
        const { data } = await apiClient.patch<PortfolioDto>(`/portfolios/${portfolioId}`, payload);
        return data;
    },

    async remove(portfolioId: string): Promise<void> {
        await apiClient.delete(`/portfolios/${portfolioId}`);
    },
};
