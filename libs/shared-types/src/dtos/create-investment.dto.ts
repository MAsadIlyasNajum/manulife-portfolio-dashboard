import { AssetType } from '../enums/asset-type.enum';

export interface CreateInvestmentDto {
    portfolioId: string;
    name: string;
    assetType: AssetType;
    quantity: number;
    purchasePrice: number;
    currentPrice: number;
}
