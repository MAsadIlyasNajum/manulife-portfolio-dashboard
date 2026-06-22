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
import { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { InvestmentResponseDto } from './dto/investment-response.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { InvestmentsListResult } from './interfaces/investments-list-result.interface';
import { InvestmentsService } from './investments.service';

@ApiTags('Investments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) { }

  @Post('portfolios/:portfolioId/investments')
  @ApiOperation({ summary: 'Create investment in owned portfolio' })
  @ApiCreatedResponse({ type: InvestmentResponseDto })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiNotFoundResponse({ description: 'Portfolio not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Param('portfolioId') portfolioId: string,
    @Body() createInvestmentDto: CreateInvestmentDto,
  ): Promise<InvestmentResponseDto> {
    return this.investmentsService.create(user.id, portfolioId, createInvestmentDto);
  }

  @Get('portfolios/:portfolioId/investments')
  @ApiOperation({ summary: 'List investments in owned portfolio' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/InvestmentResponseDto' },
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
  @ApiNotFoundResponse({ description: 'Portfolio not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAllByPortfolio(
    @CurrentUser() user: AuthenticatedUser,
    @Param('portfolioId') portfolioId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<InvestmentsListResult> {
    return this.investmentsService.findAllByPortfolio(user.id, portfolioId, page, limit);
  }

  @Get('investments/:id')
  @ApiOperation({ summary: 'Get investment by id' })
  @ApiOkResponse({ type: InvestmentResponseDto })
  @ApiNotFoundResponse({ description: 'Investment not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<InvestmentResponseDto> {
    return this.investmentsService.findOne(user.id, id);
  }

  @Patch('investments/:id')
  @ApiOperation({ summary: 'Update investment' })
  @ApiOkResponse({ type: InvestmentResponseDto })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiNotFoundResponse({ description: 'Investment not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateInvestmentDto: UpdateInvestmentDto,
  ): Promise<InvestmentResponseDto> {
    return this.investmentsService.update(user.id, id, updateInvestmentDto);
  }

  @Delete('investments/:id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete investment' })
  @ApiNoContentResponse({ description: 'Investment deleted' })
  @ApiNotFoundResponse({ description: 'Investment not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string): Promise<void> {
    await this.investmentsService.remove(user.id, id);
  }
}
