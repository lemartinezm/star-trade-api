import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { TokenPayload } from 'src/auth/interfaces/auth.service';
import { TransactionType } from './interfaces/transactions.interface';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Transaction } from './entities/transaction.entity';
import { ApiException } from 'src/utils/exception.entity';
import { PaginatedResponse } from 'src/utils/responses';

@Controller('transactions')
@UseGuards(AuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags('Transactions')
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Transaction created', type: Transaction })
  @ApiBadRequestResponse({
    description: 'Something went wrong',
    type: ApiException,
  })
  @ApiNotFoundResponse({
    description: 'Account number not found',
    type: ApiException,
  })
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    const transaction =
      await this.transactionsService.create(createTransactionDto);
    const response = {
      sourceAccountNumber: transaction.sourceAccount.accountNumber,
      destinationAccountNumber: transaction.destinationAccount.accountNumber,
      amount: transaction.amount,
      description: transaction.description,
      status: transaction.status,
    };
    return response;
  }

  @Get()
  @ApiQuery({ name: 'type', enum: TransactionType, required: false })
  @ApiQuery({ name: 'page', description: 'Page number', required: false })
  @ApiQuery({ name: 'epp', description: 'Elements per page', required: false })
  @ApiQuery({
    name: 'startDate',
    description: 'Start date',
    required: false,
    type: 'timestamp',
  })
  @ApiQuery({
    name: 'endDate',
    description: 'End date',
    required: false,
    type: 'timestamp',
  })
  @ApiOkResponse({ description: 'Transactions found', type: PaginatedResponse })
  @ApiNotFoundResponse({
    description: 'Transactions not found',
    type: ApiException,
  })
  async findAll(
    @Req() req: Request & { user: TokenPayload },
    @Query('type') transactionType: TransactionType,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('epp', new DefaultValuePipe(10), ParseIntPipe) epp: number,
    @Query(
      'startDate',
      new DefaultValuePipe(new Date(2023, 0, 1).getTime()),
      new ParseIntPipe(),
    )
    startDate: number | null,
    @Query(
      'endDate',
      new DefaultValuePipe(new Date().getTime()),
      new ParseIntPipe(),
    )
    endDate: number | null,
  ) {
    const { id: userId } = req.user;

    if (transactionType === TransactionType.INCOMES)
      return await this.transactionsService.findIncomesByUserId(userId);
    if (transactionType === TransactionType.EXPENSES)
      return await this.transactionsService.findExpensesByUserId(userId);

    const { transactionsFound, transactionsNumber } =
      await this.transactionsService.findAllByUserId(
        userId,
        page,
        epp,
        startDate,
        endDate,
      );

    const response = new PaginatedResponse(
      transactionsFound,
      page,
      epp,
      transactionsNumber,
    );

    return response;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
