import { PrismaClient } from '@prisma/client';
import { RefreshToken } from '../model/refresh-token.model';

const prisma = new PrismaClient();

export class RefreshTokenService {
  async createToken(
    data: Omit<RefreshToken, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<RefreshToken> {
    return prisma.refreshToken.create({ data });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({ where: { token } });
  }

  async revokeToken(token: string): Promise<RefreshToken> {
    const found = await prisma.refreshToken.findUnique({ where: { token } });
    if (!found) throw new Error('Token not found');
    return prisma.refreshToken.update({
      where: { token },
      data: { revoked: true },
    });
  }
}
