import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  lastName: string;

  @IsString()
  @IsEmail()
  @MaxLength(64)
  email: string;

  @IsString()
  password: string;
}
