import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PortfolioAllocationDto } from './dto/portfolio-allocation.dto';
import { PortfolioPerformanceDto } from './dto/portfolio-performance.dto';
import { PortfolioSummaryDto } from './dto/portfolio-summary.dto';
import { PortfolioAnalyticsService } from './portfolio-analytics.service';

interface AuthenticatedUser {
    id: string;
    email: string;
    role: string;
}

@ApiTags('Portfolio Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('portfolios/:portfolioId')
export class PortfolioAnalyticsController {
    constructor(private readonly portfolioAnalyticsService: PortfolioAnalyticsService) { }

    @Get('summary')
    @ApiOperation({ summary: 'Get portfolio summary metrics' })
    @ApiOkResponse({ type: PortfolioSummaryDto })
    @ApiNotFoundResponse({ description: 'Portfolio not found' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    getSummary(
        @CurrentUser() user: AuthenticatedUser,
        @Param('portfolioId') portfolioId: string,
    ): Promise<PortfolioSummaryDto> {
        return this.portfolioAnalyticsService.getSummary(user.id, portfolioId);
    }

    @Get('allocation')
    @ApiOperation({ summary: 'Get portfolio allocation' })
    @ApiOkResponse({ type: PortfolioAllocationDto })
    @ApiNotFoundResponse({ description: 'Portfolio not found' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    getAllocation(
        @CurrentUser() user: AuthenticatedUser,
        @Param('portfolioId') portfolioId: string,
    ): Promise<PortfolioAllocationDto> {
        return this.portfolioAnalyticsService.getAllocation(user.id, portfolioId);
    }

    @Get('performance')
    @ApiOperation({ summary: 'Get portfolio performance by investment' })
    @ApiOkResponse({ type: PortfolioPerformanceDto })
    @ApiNotFoundResponse({ description: 'Portfolio not found' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    getPerformance(
        @CurrentUser() user: AuthenticatedUser,
        @Param('portfolioId') portfolioId: string,
    ): Promise<PortfolioPerformanceDto> {
        return this.portfolioAnalyticsService.getPerformance(user.id, portfolioId);
    }
}