import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { TokenPayload } from 'src/auth/interfaces/auth.service';

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
  findAll(@Req() req: Request & { user: TokenPayload }) {
    return this.transactionsService.findAllByUserId(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
