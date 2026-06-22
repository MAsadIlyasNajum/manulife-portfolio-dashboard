import { Controller, Post, Get, Body, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  CurrentUserDto,
  RefreshTokenDto,
  RefreshTokenResponseDto,
} from './dtos';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  /**
   * User registration endpoint
   * Creates a new user account
   */
  @Post('register')
  @HttpCode(201)
  @ApiOperation({
    summary: 'User registration',
    description: 'Register a new user account with email and password.',
  })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    type: CurrentUserDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists',
  })
  async register(@Body() registerDto: RegisterDto): Promise<CurrentUserDto> {
    return this.authService.register(registerDto);
  }

  /**
   * User login endpoint
   * Returns access token, refresh token, and user information
   */
  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user with email and password. Returns access and refresh tokens.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  /**
   * Refresh access token endpoint
   * Uses refresh token to issue new access and refresh tokens
   */
  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Issue new access and refresh tokens using a valid refresh token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refresh successful',
    type: RefreshTokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token',
  })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  /**
   * Logout endpoint
   * Invalidates current session (client-side token clearing required)
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'User logout',
    description: 'Logout user. Tokens should be cleared client-side.',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async logout() {
    return this.authService.logout();
  }

  /**
   * Get current user information
   * Requires valid JWT access token
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user',
    description: 'Retrieve authenticated user information from JWT token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user information',
    type: CurrentUserDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getCurrentUser(@CurrentUser() user: any): Promise<CurrentUserDto> {
    return this.authService.getCurrentUser(user.id);
  }
}
