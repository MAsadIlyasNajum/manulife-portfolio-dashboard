import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../common/prisma.service';
import { PortfoliosService } from './portfolios.service';

describe('PortfoliosService', () => {
  let service: PortfoliosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfoliosService,
        {
          provide: PrismaService,
          useValue: {
            portfolio: {
              create: jest.fn(),
              count: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PortfoliosService>(PortfoliosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});