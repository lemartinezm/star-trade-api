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
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { TokenPayload } from 'src/auth/interfaces/auth.service';
import { TransactionType } from './interfaces/transactions.interface';

@Controller('transactions')
@UseGuards(AuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
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
  async findAll(
    @Req() req: Request & { user: TokenPayload },
    @Query('type') transactionType: TransactionType,
  ) {
    const { id: userId } = req.user;

    if (transactionType === TransactionType.INCOMES)
      return await this.transactionsService.findIncomesByUserId(userId);
    if (transactionType === TransactionType.EXPENSES)
      return await this.transactionsService.findExpensesByUserId(userId);

    return await this.transactionsService.findAllByUserId(userId);
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
