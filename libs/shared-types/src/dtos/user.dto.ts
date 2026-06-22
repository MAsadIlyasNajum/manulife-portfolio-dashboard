import { UserRole } from '../enums/user-role.enum';

export interface UserDto {
  // Placeholder DTO contract for future implementation.
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
