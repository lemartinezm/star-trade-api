import { Account } from 'src/accounts/entities/account.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionStatus } from '../interfaces/transactions.interface';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Transaction ID', example: 410 })
  id: number;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  @ApiProperty({ description: 'Transaction amount', example: 48.48 })
  amount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({
    description: 'Transaction description',
    example: 'Service payment',
    required: false,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  @ApiProperty({
    description: 'Transaction status',
    example: TransactionStatus.PENDING,
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'Transaction creation date',
    example: '2022-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ManyToOne(() => Account, (account) => account.sourceTransactions)
  sourceAccount: Account;

  @ManyToOne(() => Account, (account) => account.sourceTransactions)
  destinationAccount: Account;
}
