import { TransactionType } from '../enums/transaction-type.enum';

export interface TransactionDto {
  // Placeholder DTO contract for future implementation.
  id: string;
  investmentId: string;
  type: TransactionType;
  quantity: number;
  price: number;
  transactionDate: string;
  notes?: string;
  createdAt: string;
}
