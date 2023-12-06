import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import Decimal from 'decimal.js';
import { UpdateBalanceOperations } from './interfaces/account.service';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
  ) {}

  async create(userId: number) {
    const [, numberOfAccountsFromUser] =
      await this.accountsRepository.findAndCount({
        where: { user: { id: userId } },
      });

    if (numberOfAccountsFromUser >= 3)
      throw new ForbiddenException('The user cannot create more accounts');

    const account = new Account();
    const generatedAccountNumber = this.generateAccountNumber(userId);
    account.accountNumber = generatedAccountNumber;
    account.user = { id: userId } as User;
    const createdAccount = await this.accountsRepository.save(account);
    return createdAccount;
  }

  async findAll() {
    const allAccounts = await this.accountsRepository.find({
      relations: { user: true },
      select: {
        id: true,
        accountNumber: true,
        balance: true,
        user: { id: true, name: true, lastName: true, email: true },
      },
    });
    return allAccounts;
  }

  async findAllByUserId(userId: number) {
    const accountsFound = await this.accountsRepository.find({
      where: { user: { id: userId } },
    });

    if (accountsFound.length === 0)
      throw new NotFoundException(
        'No accounts associated with user were found',
      );

    return accountsFound;
  }

  async findOneByAccountNumber(accountNumber: string) {
    const accountFound = await this.accountsRepository.findOne({
      where: { accountNumber },
      select: { id: true, accountNumber: true, balance: true },
    });
    if (!accountFound) throw new NotFoundException('Account not found');
    return accountFound;
  }

  async updateBalance(
    accountNumber: string,
    amount: number,
    operation: UpdateBalanceOperations,
  ) {
    const account = await this.findOneByAccountNumber(accountNumber);

    // Check if account has enough balance
    if (
      account.balance < amount &&
      operation === UpdateBalanceOperations.SUBTRACT
    )
      throw new BadRequestException('Insufficient balance');

    let newBalance: number;
    if (operation === UpdateBalanceOperations.ADD)
      newBalance = new Decimal(account.balance).add(amount).toNumber();
    else newBalance = new Decimal(account.balance).sub(amount).toNumber();

    account.balance = newBalance;
    const updatedAccount = await this.accountsRepository.save(account);
    return updatedAccount;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }

  generateAccountNumber(userId: number): string {
    return (
      '1821' +
      '0'.repeat(6 - userId.toString().length) +
      userId.toString() +
      Date.now().toString()
    );
  }
}
