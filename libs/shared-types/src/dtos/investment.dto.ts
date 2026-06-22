import { AssetType } from '../enums/asset-type.enum';

export interface InvestmentDto {
  // Placeholder DTO contract for future implementation.
  id: string;
  portfolioId: string;
  name: string;
  assetType: AssetType;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  createdAt: string;
  updatedAt: string;
}
