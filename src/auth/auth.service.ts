import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const userCreated = await this.usersService.create(createUserDto);
    return userCreated;
  }

  async generateToken(loginUserDto: LoginUserDto) {
    const userFound = await this.usersService.findOneByEmail(
      loginUserDto.email,
    );
    if (!userFound) throw new UnauthorizedException();

    const passwordMatches = await bcrypt.compare(
      loginUserDto.password,
      userFound.password,
    );
    if (!passwordMatches) throw new UnauthorizedException();

    const payload = {
      id: userFound.id,
      email: userFound.email,
      role: userFound.role,
    };

    return await this.jwtService.signAsync(payload);
  }
}
