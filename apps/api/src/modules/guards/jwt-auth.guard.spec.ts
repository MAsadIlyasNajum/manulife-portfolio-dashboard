import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
    let guard: JwtAuthGuard;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [JwtAuthGuard],
        }).compile();

        guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    describe('canActivate', () => {
        it('should allow request with valid JWT token', async () => {
            // TODO: Implement test
            // Mock ExecutionContext with valid JWT
            // Verify guard returns true or allows request
        });

        it('should reject request without JWT token', async () => {
            // TODO: Implement test
            // Mock ExecutionContext without JWT
            // Verify guard throws UnauthorizedException
        });

        it('should reject request with invalid JWT token', async () => {
            // TODO: Implement test
            // Mock ExecutionContext with invalid JWT
            // Verify guard throws UnauthorizedException
        });
    });
});
