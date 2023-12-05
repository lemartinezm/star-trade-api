import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ type: 'varchar', length: 64 })
  name: string;

  @Column({ type: 'varchar', length: 64 })
  lastName: string;

  @Column() // add foreign key to profile image table
  profileImageId: number;

  @Column({ type: 'varchar', length: 64 })
  email: string;

  @Column({ type: 'varchar', length: 256 })
  password: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;
}
