import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAccountDto {
  @IsOptional()
  @IsString()
  @MaxLength(32)
  @IsNotEmpty()
  @ApiProperty({ description: 'Account Label', required: false, maxLength: 32 })
  accountLabel?: string;
}
