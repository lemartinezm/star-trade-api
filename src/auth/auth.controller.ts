import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Request } from 'express';
import { extractToken } from 'src/utils/auth';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { ApiException } from 'src/utils/exception.entity';

// TODO: terminar la doc con swagger
@ApiTags('Auth')
@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ description: 'User created', type: User })
  @ApiBadRequestResponse({
    description: 'Something went wrong',
    type: ApiException,
  })
  async registerUser(@Body() createUserDto: CreateUserDto) {
    try {
      const userCreated = await this.authService.register(createUserDto);
      return userCreated;
    } catch (error) {
      throw new BadRequestException({ code: error.code });
    }
  }

  @Post('login')
  @ApiOkResponse({
    description: 'User logged in',
    schema: {
      type: 'object',
      example: { accessToken: 'token' },
    },
  })
  @ApiBadRequestResponse({
    description: 'Something went wrong',
    type: ApiException,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ApiException,
  })
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    try {
      const token = await this.authService.generateToken(loginUserDto);
      return {
        accessToken: token,
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      if (error instanceof UnauthorizedException) throw error;
      if (error instanceof ForbiddenException) throw error;
      else throw new InternalServerErrorException();
    }
  }

  @Get('token')
  async verifyToken(@Req() request: Request) {
    const token = extractToken(request);
    if (!token) throw new UnauthorizedException('Token is missing in headers');

    const isValid = await this.authService.verifyToken(token);
    if (!isValid) throw new UnauthorizedException('Invalid token');

    return {
      message: 'Valid token',
    };
  }
}
