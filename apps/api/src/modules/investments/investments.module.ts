import { Module } from '@nestjs/common';

import { PrismaService } from '../common/prisma.service';
import { InvestmentsController } from './investments.controller';
import { InvestmentsService } from './investments.service';

@Module({
  controllers: [InvestmentsController],
  providers: [InvestmentsService, PrismaService],
  exports: [InvestmentsService],
})
export class InvestmentsModule { }
