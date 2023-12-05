import { Account } from 'src/accounts/entities/account.entity';
import { ProfileImage } from 'src/profile-images/entities/profile-image.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64 })
  name: string;

  @Column({ type: 'varchar', length: 64 })
  lastName: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 256 })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  modifiedAt: Date;

  @OneToMany(() => ProfileImage, (profileImage) => profileImage.user)
  profileImages: ProfileImage[];

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];
}
