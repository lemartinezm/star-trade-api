import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Brackets, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountsService } from 'src/accounts/accounts.service';
import { UpdateBalanceOperations } from 'src/accounts/interfaces/account.service';
import { TransactionStatus } from './interfaces/transactions.interface';

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

  async findAllByUserId(
    userId: number,
    page: number,
    epp: number,
    startDate: number | null,
    endDate: number | null,
  ) {
    const [transactionsFound, transactionsNumber] =
      await this.transactionsRepository
        .createQueryBuilder('transaction')
        .leftJoinAndSelect('transaction.sourceAccount', 'sourceAccount')
        .leftJoinAndSelect(
          'transaction.destinationAccount',
          'destinationAccount',
        )
        .select([
          'transaction',
          'sourceAccount.accountNumber',
          'destinationAccount.accountNumber',
        ])
        .where(
          'transaction.createdAt >= :startDate AND transaction.createdAt < :endDate',
          {
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : new Date(),
          },
        )
        .andWhere(
          new Brackets((qb) => {
            qb.where('sourceAccount.user = :sourceUserId', {
              sourceUserId: userId,
            }).orWhere('destinationAccount.user = :destinationUserId', {
              destinationUserId: userId,
            });
          }),
        )
        .orderBy('transaction.createdAt', 'DESC')
        .skip((page - 1) * epp)
        .take(epp)
        .getManyAndCount();

    if (transactionsFound.length <= 0)
      throw new NotFoundException('No transactions were found for the user');
    return { transactionsFound, transactionsNumber };
  }

  async findIncomesByUserId(
    userId: number,
    page: number,
    epp: number,
    startDate: number | null,
    endDate: number | null,
  ) {
    const [transactionsFound, transactionsNumber] =
      await this.transactionsRepository
        .createQueryBuilder('transaction')
        .leftJoinAndSelect('transaction.sourceAccount', 'sourceAccount')
        .leftJoinAndSelect(
          'transaction.destinationAccount',
          'destinationAccount',
        )
        .select([
          'transaction',
          'sourceAccount.accountNumber',
          'destinationAccount.accountNumber',
        ])
        .where(
          'transaction.createdAt >= :startDate AND transaction.createdAt < :endDate',
          {
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : new Date(),
          },
        )
        .andWhere('destinationAccount.user = :userId', { userId })
        .orderBy('transaction.createdAt', 'DESC')
        .skip((page - 1) * epp)
        .take(epp)
        .getManyAndCount();

    if (transactionsFound.length <= 0)
      throw new NotFoundException('No transactions were found for the user');
    return { transactionsFound, transactionsNumber };
  }

  async findExpensesByUserId(
    userId: number,
    page: number,
    epp: number,
    startDate: number | null,
    endDate: number | null,
  ) {
    const [transactionsFound, transactionsNumber] =
      await this.transactionsRepository
        .createQueryBuilder('transaction')
        .leftJoinAndSelect('transaction.sourceAccount', 'sourceAccount')
        .leftJoinAndSelect(
          'transaction.destinationAccount',
          'destinationAccount',
        )
        .select([
          'transaction',
          'sourceAccount.accountNumber',
          'destinationAccount.accountNumber',
        ])
        .where(
          'transaction.createdAt >= :startDate AND transaction.createdAt < :endDate',
          {
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : new Date(),
          },
        )
        .andWhere('sourceAccount.user = :userId', { userId })
        .orderBy('transaction.createdAt', 'DESC')
        .skip((page - 1) * epp)
        .take(epp)
        .getManyAndCount();

    if (transactionsFound.length <= 0)
      throw new NotFoundException('No transactions were found for the user');
    return { transactionsFound, transactionsNumber };
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
