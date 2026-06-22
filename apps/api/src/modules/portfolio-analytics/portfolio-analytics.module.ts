import { Module } from '@nestjs/common';

import { PrismaService } from '../common/prisma.service';
import { PortfolioAnalyticsController } from './portfolio-analytics.controller';
import { PortfolioAnalyticsService } from './portfolio-analytics.service';

@Module({
    controllers: [PortfolioAnalyticsController],
    providers: [PortfolioAnalyticsService, PrismaService],
    exports: [PortfolioAnalyticsService],
})
export class PortfolioAnalyticsModule { }