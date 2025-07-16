import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RefreshTokenService } from './refresh-token.service';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export class AuthService {
  private refreshTokenService = new RefreshTokenService();

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = await this.refreshTokenService.createToken({
      userId: user.id,
      token: jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' }),
      revoked: false,
    });
    return { accessToken, refreshToken: refreshToken.token };
  }

  async register(email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error('Email already registered');
    const hashed = await bcrypt.hash(password, 10);
    return prisma.user.create({ data: { email, password: hashed } });
  }

  async refreshToken(token: string) {
    const stored = await this.refreshTokenService.findByToken(token);
    if (!stored || stored.revoked) throw new Error('Invalid refresh token');
    interface JwtPayload {
      userId: number;
      iat: number;
      exp: number;
    }
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const accessToken = jwt.sign({ userId: payload.userId }, JWT_SECRET, {
      expiresIn: '15m',
    });
    return { accessToken };
  }

  async logout(token: string) {
    await this.refreshTokenService.revokeToken(token);
  }
}
