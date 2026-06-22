import { TransactionResponseDto } from '../dto/transaction-response.dto';

export interface TransactionsListResult {
    data: TransactionResponseDto[];
    meta: {
        page: number;
        limit: number;
        total: number;
    };
}