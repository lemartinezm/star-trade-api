import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { TokenPayload } from 'src/auth/interfaces/auth.service';
import { UserRole } from 'src/users/entities/user.entity';

@Controller('accounts')
@UseGuards(AuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async create(
    @Req()
    req: Request & { user: TokenPayload },
  ) {
    const { id: userId } = req.user;
    return this.accountsService.create(userId);
  }

  @Get()
  async findAll(
    @Req()
    req: Request & { user: TokenPayload },
  ) {
    const { id: userId, role } = req.user;
    if (role === UserRole.USER)
      return await this.accountsService.findAllByUserId(userId);
    return this.accountsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountsService.findOneByAccountNumber(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountsService.remove(+id);
  }
}
