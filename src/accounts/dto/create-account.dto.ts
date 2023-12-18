import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAccountDto {
  @IsOptional()
  @IsString()
  @MaxLength(32)
  @IsNotEmpty()
  accountLabel?: string;
}
