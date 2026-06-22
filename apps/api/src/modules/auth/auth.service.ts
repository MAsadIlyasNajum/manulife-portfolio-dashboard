import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  CurrentUserDto,
  RefreshTokenDto,
  RefreshTokenResponseDto,
} from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Hash password using bcrypt
   * @param password Raw password
   * @returns Hashed password
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare raw password with hashed password
   * @param password Raw password
   * @param hash Hashed password
   * @returns true if password matches, false otherwise
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Register a new user
   * @param registerDto Email and password
   * @returns Created user information
   */
  async register(registerDto: RegisterDto): Promise<CurrentUserDto> {
    const { email, password } = registerDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await this.hashPassword(password);
    const user = await this.usersService.create(email, passwordHash);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  /**
   * Login user with email and password
   * @param loginDto Email and password
   * @returns Access token, refresh token, and user info
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email, user.role);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Refresh access token using refresh token
   * @param refreshTokenDto Refresh token
   * @returns New access and refresh tokens
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
    const { refreshToken } = refreshTokenDto;

    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Verify user still exists
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user.id, user.email, user.role);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /**
   * Validate user from JWT payload (used by Passport strategy)
   * @param userId User ID from JWT
   * @returns User if found
   */
  async validateUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  /**
   * Get current user information (requires valid JWT)
   * @param userId User ID from JWT
   * @returns Current user information
   */
  async getCurrentUser(userId: string): Promise<CurrentUserDto> {
    const user = await this.validateUser(userId);
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  /**
   * Generate access and refresh tokens
   * @param userId User ID
   * @param email User email
   * @param role User role
   * @returns Access and refresh tokens
   */
  private async generateTokens(userId: string, email: string, role: string) {
    const jwtPayload = {
      sub: userId,
      email,
      role,
    };

    const accessExpiry = (this.configService.get('JWT_ACCESS_EXPIRES_IN') ?? '15m') as unknown as JwtSignOptions['expiresIn'];
    const refreshExpiry = (this.configService.get('JWT_REFRESH_EXPIRES_IN') ?? '7d') as unknown as JwtSignOptions['expiresIn'];

    const accessToken = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: accessExpiry,
    });

    const refreshToken = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: refreshExpiry,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Logout endpoint (stateless JWT - documented for future implementation)
   * In a production system, this would:
   * - Invalidate refresh tokens (token blacklist)
   * - Remove session from Redis
   * - Track revoked tokens
   *
   * For this assignment, logout is handled client-side by clearing tokens.
   */
  logout() {
    return {
      message: 'Logout successful. Please clear tokens client-side.',
    };
  }
}
