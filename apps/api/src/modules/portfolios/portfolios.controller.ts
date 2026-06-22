import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { PortfolioResponseDto } from './dto/portfolio-response.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import { PortfolioListResult } from './interfaces/portfolio-list-result.interface';
import { PortfoliosService } from './portfolios.service';

@ApiTags('Portfolios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @Post()
  @ApiOperation({ summary: 'Create portfolio' })
  @ApiCreatedResponse({ type: PortfolioResponseDto })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createPortfolioDto: CreatePortfolioDto,
  ): Promise<PortfolioResponseDto> {
    return this.portfoliosService.create(user.id, createPortfolioDto);
  }

  @Get()
  @ApiOperation({ summary: 'List portfolios' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/PortfolioResponseDto' },
        },
        meta: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            total: { type: 'number', example: 5 },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PortfolioListResult> {
    return this.portfoliosService.findAll(user.id, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get portfolio by id' })
  @ApiOkResponse({ type: PortfolioResponseDto })
  @ApiNotFoundResponse({ description: 'Portfolio not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<PortfolioResponseDto> {
    return this.portfoliosService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update portfolio' })
  @ApiOkResponse({ type: PortfolioResponseDto })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiNotFoundResponse({ description: 'Portfolio not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
  ): Promise<PortfolioResponseDto> {
    return this.portfoliosService.update(user.id, id, updatePortfolioDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete portfolio' })
  @ApiNoContentResponse({ description: 'Portfolio deleted' })
  @ApiNotFoundResponse({ description: 'Portfolio not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string): Promise<void> {
    await this.portfoliosService.remove(user.id, id);
  }
}
