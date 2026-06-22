import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
    let strategy: JwtStrategy;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key) => {
                            const config: Record<string, string> = {
                                JWT_ACCESS_SECRET: 'access-secret',
                            };
                            return config[key];
                        }),
                    },
                },
            ],
        }).compile();

        strategy = module.get<JwtStrategy>(JwtStrategy);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(strategy).toBeDefined();
    });

    describe('validate', () => {
        it('should return user object from JWT payload', () => {
            // TODO: Implement test
            // Call strategy.validate with JWT payload
            // Verify user object returned with id, email, role
        });
    });
});
