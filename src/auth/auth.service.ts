import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const userCreated = await this.usersService.create(createUserDto);
    return userCreated;
  }

  async generateToken(loginUserDto: LoginUserDto) {
    const userFound = await this.usersService.findOneByEmail(
      loginUserDto.email,
    );
    if (!userFound)
      throw new UnauthorizedException('Invalid email or password');

    const passwordMatches = await bcrypt.compare(
      loginUserDto.password,
      userFound.password,
    );
    if (!passwordMatches)
      throw new UnauthorizedException('Invalid email or password');

    const payload: TokenPayload = {
      id: userFound.id,
      email: userFound.email,
      role: userFound.role,
    };

    return await this.jwtService.signAsync(payload);
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return Boolean(payload);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
