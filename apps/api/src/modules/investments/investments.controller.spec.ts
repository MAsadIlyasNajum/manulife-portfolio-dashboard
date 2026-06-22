import { Test, TestingModule } from '@nestjs/testing';

import { InvestmentsController } from './investments.controller';
import { InvestmentsService } from './investments.service';

describe('InvestmentsController', () => {
    let controller: InvestmentsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [InvestmentsController],
            providers: [
                {
                    provide: InvestmentsService,
                    useValue: {
                        create: jest.fn(),
                        findAllByPortfolio: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<InvestmentsController>(InvestmentsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});