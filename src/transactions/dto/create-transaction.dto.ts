import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  @ApiProperty({
    description: 'Source account number',
    example: '18210502301701905461230',
  })
  sourceAccountNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  @ApiProperty({
    description: 'Destination account number',
    example: '18210502301701905461230',
  })
  destinationAccountNumber: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(9999.99)
  @ApiProperty({
    description: 'Transaction amount',
    minimum: 1,
    maximum: 9999.99,
    example: '1500.99',
  })
  amount: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'Transaction description',
    maxLength: 255,
    example: 'Service payment',
    required: false,
  })
  description?: string;
}
