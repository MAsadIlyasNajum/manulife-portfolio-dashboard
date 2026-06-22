import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../common/prisma.service';
import { InvestmentsService } from './investments.service';

describe('InvestmentsService', () => {
    let service: InvestmentsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InvestmentsService,
                {
                    provide: PrismaService,
                    useValue: {
                        portfolio: {
                            findFirst: jest.fn(),
                        },
                        investment: {
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

        service = module.get<InvestmentsService>(InvestmentsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});