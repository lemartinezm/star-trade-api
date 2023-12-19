import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @ApiProperty({
    description: 'User name',
    example: 'Marty',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @ApiProperty({
    description: 'User lastname',
    example: 'McFly',
  })
  lastName: string;

  @IsString()
  @IsEmail()
  @MaxLength(64)
  @ApiProperty({
    description: 'User email',
    example: 'marty@mcfly.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'User password',
    example: 'password555',
  })
  password: string;
}
