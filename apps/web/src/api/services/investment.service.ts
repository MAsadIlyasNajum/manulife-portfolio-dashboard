import type {
    CreateInvestmentDto,
    InvestmentDto,
    UpdateInvestmentDto,
} from '@portfolio/shared-types';

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

type CreateInvestmentPayload = Omit<CreateInvestmentDto, 'portfolioId'>;

export const investmentService = {
    async create(portfolioId: string, payload: CreateInvestmentPayload): Promise<InvestmentDto> {
        const { data } = await apiClient.post<InvestmentDto>(
            `/portfolios/${portfolioId}/investments`,
            payload
        );
        return data;
    },

    async listByPortfolio(
        portfolioId: string,
        params?: { page?: number; limit?: number }
    ): Promise<PaginatedResponse<InvestmentDto>> {
        const { data } = await apiClient.get<PaginatedResponse<InvestmentDto>>(
            `/portfolios/${portfolioId}/investments`,
            { params }
        );
        return data;
    },

    async getById(investmentId: string): Promise<InvestmentDto> {
        const { data } = await apiClient.get<InvestmentDto>(`/investments/${investmentId}`);
        return data;
    },

    async update(investmentId: string, payload: UpdateInvestmentDto): Promise<InvestmentDto> {
        const { data } = await apiClient.patch<InvestmentDto>(`/investments/${investmentId}`, payload);
        return data;
    },

    async remove(investmentId: string): Promise<void> {
        await apiClient.delete(`/investments/${investmentId}`);
    },
};
