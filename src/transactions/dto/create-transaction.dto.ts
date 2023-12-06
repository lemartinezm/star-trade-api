import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  sourceAccountNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  destinationAccountNumber: string;

  @IsNumber()
  @IsNotEmpty()
  @Max(9999.99)
  amount: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description?: string;
}
