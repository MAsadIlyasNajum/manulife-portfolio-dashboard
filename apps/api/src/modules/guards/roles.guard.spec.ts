import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';

describe('RolesGuard', () => {
    let guard: RolesGuard;
    let reflector: Reflector;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RolesGuard,
                {
                    provide: Reflector,
                    useValue: {
                        getAllAndOverride: jest.fn(),
                    },
                },
            ],
        }).compile();

        guard = module.get<RolesGuard>(RolesGuard);
        reflector = module.get<Reflector>(Reflector);
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    describe('canActivate', () => {
        it('should allow request when no roles required', async () => {
            // TODO: Implement test
            // Mock Reflector.getAllAndOverride to return null
            // Verify guard returns true
        });

        it('should allow request when user has required role', async () => {
            // TODO: Implement test
            // Mock Reflector.getAllAndOverride to return ['ADMIN']
            // Mock user with ADMIN role
            // Verify guard returns true
        });

        it('should reject request when user lacks required role', async () => {
            // TODO: Implement test
            // Mock Reflector.getAllAndOverride to return ['ADMIN']
            // Mock user with USER role
            // Verify guard throws ForbiddenException
        });
    });
});
