import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { InvestmentsModule } from './modules/investments/investments.module';
import { PortfolioAnalyticsModule } from './modules/portfolio-analytics/portfolio-analytics.module';
import { PortfoliosModule } from './modules/portfolios/portfolios.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    // Environment configuration scaffold.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/api/.env.local', 'apps/api/.env'],
    }),
    AuthModule,
    UsersModule,
    PortfoliosModule,
    PortfolioAnalyticsModule,
    InvestmentsModule,
    TransactionsModule,
  ],
})
export class AppModule { }
