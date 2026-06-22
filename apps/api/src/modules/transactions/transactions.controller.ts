import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiCreatedResponse,
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
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { TransactionsListResult } from './interfaces/transactions-list-result.interface';
import { TransactionsService } from './transactions.service';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Post('investments/:investmentId/transactions')
  @ApiOperation({ summary: 'Create BUY/SELL transaction for owned investment' })
  @ApiCreatedResponse({ type: TransactionResponseDto })
  @ApiBadRequestResponse({ description: 'Validation error or insufficient quantity for SELL' })
  @ApiNotFoundResponse({ description: 'Investment not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Param('investmentId') investmentId: string,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.create(user.id, investmentId, createTransactionDto);
  }

  @Get('investments/:investmentId/transactions')
  @ApiOperation({ summary: 'List transactions by investment' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/TransactionResponseDto' },
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
  @ApiNotFoundResponse({ description: 'Investment not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAllByInvestment(
    @CurrentUser() user: AuthenticatedUser,
    @Param('investmentId') investmentId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<TransactionsListResult> {
    return this.transactionsService.findAllByInvestment(user.id, investmentId, page, limit);
  }

  @Get('transactions/:id')
  @ApiOperation({ summary: 'Get transaction by id' })
  @ApiOkResponse({ type: TransactionResponseDto })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.findOne(user.id, id);
  }
}
