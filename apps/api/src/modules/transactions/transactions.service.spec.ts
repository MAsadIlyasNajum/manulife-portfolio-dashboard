import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../common/prisma.service';
import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
    let service: TransactionsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TransactionsService,
                {
                    provide: PrismaService,
                    useValue: {
                        investment: {
                            findFirst: jest.fn(),
                        },
                        transaction: {
                            create: jest.fn(),
                            count: jest.fn(),
                            findMany: jest.fn(),
                            findFirst: jest.fn(),
                            groupBy: jest.fn(),
                        },
                        $transaction: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<TransactionsService>(TransactionsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});