import type { CreateTransactionDto, TransactionDto } from '@portfolio/shared-types';

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

export const transactionService = {
    async create(investmentId: string, payload: CreateTransactionDto): Promise<TransactionDto> {
        const { data } = await apiClient.post<TransactionDto>(
            `/investments/${investmentId}/transactions`,
            payload
        );
        return data;
    },

    async listByInvestment(
        investmentId: string,
        params?: { page?: number; limit?: number }
    ): Promise<PaginatedResponse<TransactionDto>> {
        const { data } = await apiClient.get<PaginatedResponse<TransactionDto>>(
            `/investments/${investmentId}/transactions`,
            { params }
        );
        return data;
    },

    async getById(transactionId: string): Promise<TransactionDto> {
        const { data } = await apiClient.get<TransactionDto>(`/transactions/${transactionId}`);
        return data;
    },
};
