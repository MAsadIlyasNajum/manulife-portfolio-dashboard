import { PortfolioResponseDto } from '../dto/portfolio-response.dto';

export interface PortfolioListResult {
  data: PortfolioResponseDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}