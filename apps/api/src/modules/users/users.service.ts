import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Find a user by email address
   * @param email User email
   * @returns User with email, or null if not found
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find a user by ID
   * @param id User unique identifier
   * @returns User with ID, or null if not found
   */
  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new user
   * @param email User email
   * @param passwordHash Hashed password
   * @param role User role (defaults to USER)
   * @returns Created user
   */
  async create(email: string, passwordHash: string, role: UserRole = UserRole.USER) {
    return this.prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
      },
    });
  }
}
