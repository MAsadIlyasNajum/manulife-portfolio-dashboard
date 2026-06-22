import { InvestmentResponseDto } from '../dto/investment-response.dto';

export interface InvestmentsListResult {
    data: InvestmentResponseDto[];
    meta: {
        page: number;
        limit: number;
        total: number;
    };
}