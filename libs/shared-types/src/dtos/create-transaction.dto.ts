import { TransactionType } from '../enums/transaction-type.enum';

export interface CreateTransactionDto {
    investmentId: string;
    type: TransactionType;
    quantity: number;
    price: number;
    transactionDate: string;
    notes?: string;
}
