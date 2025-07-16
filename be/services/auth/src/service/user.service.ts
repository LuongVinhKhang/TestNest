import { PrismaClient } from '@prisma/client';
import { User } from '../model/user.model';

const prisma = new PrismaClient();

export class UserService {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    return prisma.user.create({ data });
  }

  async updateResetToken(
    userId: number,
    token: string,
    expiresAt: Date,
  ): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { resetPassToken: token, resetPassTokenExpiresAt: expiresAt },
    });
  }

  // ...add more user-related methods as needed...
}
