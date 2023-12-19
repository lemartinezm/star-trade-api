import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'User ID', example: 401 })
  id: number;

  @Column({ type: 'varchar', length: 64 })
  @ApiProperty({ description: 'User name', example: 'Marty' })
  name: string;

  @Column({ type: 'varchar', length: 64 })
  @ApiProperty({ description: 'User last name', example: 'McFly' })
  lastName: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  @ApiProperty({ description: 'User email', example: 'marty@mcfly.com' })
  email: string;

  @Column({ type: 'varchar', length: 256 })
  @ApiProperty({ description: 'User password', example: 'password555' })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  @ApiProperty({
    description: 'User role',
    example: UserRole.USER,
    enum: UserRole,
    enumName: 'UserRole',
  })
  role: UserRole;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'User creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  @ApiProperty({
    description: 'User modification date',
    example: '2023-01-01T00:00:00.000Z',
  })
  modifiedAt: Date;

  @OneToMany(() => ProfileImage, (profileImage) => profileImage.user)
  profileImages: ProfileImage[];

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];
}
