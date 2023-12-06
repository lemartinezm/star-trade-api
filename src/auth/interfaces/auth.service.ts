import { UserRole } from 'src/users/entities/user.entity';

export interface TokenPayload {
  id: number;
  email: string;
  role: UserRole;
}
