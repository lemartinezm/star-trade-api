import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Repository } from 'typeorm';
import { Transaction, TransactionStatus } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountsService } from 'src/accounts/accounts.service';
import { UpdateBalanceOperations } from 'src/accounts/interfaces/account.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    private readonly accountsService: AccountsService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const {
      amount,
      destinationAccountNumber,
      sourceAccountNumber,
      description,
    } = createTransactionDto;

    // Get accounts
    const sourceAccount =
      await this.accountsService.findOneByAccountNumber(sourceAccountNumber);
    const destinationAccount =
      await this.accountsService.findOneByAccountNumber(
        destinationAccountNumber,
      );

    // Create transaction
    const transaction = new Transaction();
    transaction.sourceAccount = sourceAccount;
    transaction.destinationAccount = destinationAccount;
    transaction.amount = amount;
    if (description) transaction.description = description;
    await this.transactionsRepository.save(transaction);

    try {
      // Update accounts balance
      const sourceAccountUpdated = await this.accountsService.updateBalance(
        sourceAccountNumber,
        amount,
        UpdateBalanceOperations.SUBTRACT,
      );
      const destinationAccountUpdated =
        await this.accountsService.updateBalance(
          destinationAccountNumber,
          amount,
          UpdateBalanceOperations.ADD,
        );

      transaction.status = TransactionStatus.COMPLETED;
      await this.transactionsRepository.save(transaction);

      transaction.sourceAccount = sourceAccountUpdated;
      transaction.destinationAccount = destinationAccountUpdated;

      return transaction;
    } catch (error) {
      transaction.status = TransactionStatus.FAILED;
      await this.transactionsRepository.save(transaction);
      throw error;
    }
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}