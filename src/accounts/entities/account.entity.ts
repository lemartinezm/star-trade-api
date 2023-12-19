import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Account ID', example: 123 })
  id: number;

  @Column({ type: 'varchar', length: 32, nullable: true })
  @ApiProperty({
    description: 'Account label',
    maxLength: 32,
    example: 'My Account',
    required: false,
  })
  accountLabel: string;

  @Column({ type: 'varchar', length: 24, unique: true })
  @ApiProperty({
    description: 'Account number',
    maxLength: 24,
    example: '18210502301701905461230',
  })
  accountNumber: string;

  @Column({ type: 'decimal', precision: 16, scale: 2, default: 0.0 })
  @ApiProperty({ description: 'Account balance', example: 123.45 })
  balance: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'Account creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.accounts, { nullable: false })
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.sourceAccount)
  sourceTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.destinationAccount)
  destinationTransactions: Transaction[];
}
