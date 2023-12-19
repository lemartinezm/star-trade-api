import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminGuard, AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { ApiException } from 'src/utils/exception.entity';

@Controller('users')
@UseGuards(AuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiCreatedResponse({ description: 'User created', type: User })
  @ApiBadRequestResponse({
    description: 'Something went wrong',
    type: ApiException,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: ApiException })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiOkResponse({ description: 'Users found', type: [User] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: ApiException })
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  @ApiOkResponse({ description: 'User found', type: User })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: ApiException })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
