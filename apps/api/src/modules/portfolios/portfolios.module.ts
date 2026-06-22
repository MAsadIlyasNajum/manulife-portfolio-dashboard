import { Module } from '@nestjs/common';

import { PrismaService } from '../common/prisma.service';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosService } from './portfolios.service';

@Module({
  controllers: [PortfoliosController],
  providers: [PortfoliosService, PrismaService],
  exports: [PortfoliosService],
})
export class PortfoliosModule {}
