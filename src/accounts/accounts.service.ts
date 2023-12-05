import { ForbiddenException, Injectable } from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

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

  findAll() {
    return `This action returns all accounts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
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
