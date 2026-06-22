import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../common/prisma.service';

describe('UsersService', () => {
    let service: UsersService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: PrismaService,
                    useValue: {
                        user: {
                            findUnique: jest.fn(),
                            create: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findByEmail', () => {
        it('should find user by email', async () => {
            // TODO: Implement test
            // Mock Prisma.user.findUnique
            // Call service.findByEmail
            // Verify user returned or null
        });
    });

    describe('findById', () => {
        it('should find user by ID', async () => {
            // TODO: Implement test
            // Mock Prisma.user.findUnique
            // Call service.findById
            // Verify user returned or null
        });
    });

    describe('create', () => {
        it('should create new user', async () => {
            // TODO: Implement test
            // Mock Prisma.user.create
            // Call service.create with email, password, role
            // Verify user created with correct data
        });
    });
});
