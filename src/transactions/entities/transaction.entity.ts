import { Account } from 'src/accounts/entities/account.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum TransactionStatus {
  PENDING = 'pending',
  FAILED = 'failed',
  COMPLETED = 'completed',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Account, (account) => account.sourceTransactions)
  sourceAccount: Account;

  @ManyToOne(() => Account, (account) => account.sourceTransactions)
  destinationAccount: Account;
}
