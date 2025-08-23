import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const privateKeyPath = process.env.JWT_PRIVATE_KEY_PATH;
const publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH;

if (!privateKeyPath || !publicKeyPath) {
  throw new Error(
    'JWT_PRIVATE_KEY_PATH and JWT_PUBLIC_KEY_PATH must be set in environment variables',
  );
}

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

export class AuthService {
  async validateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return null;
    const valid = await bcrypt.compare(password, user.password);
    return valid ? user : null;
  }

  async register(email: string, password: string, name?: string) {
    const hash = await bcrypt.hash(password, 10);
    return prisma.user.create({
      data: { email, password: hash, name },
    });
  }

  signJwt(payload: object, options?: jwt.SignOptions) {
    return jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      ...(options || {}),
    });
  }

  verifyJwt(token: string) {
    try {
      return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    } catch {
      return null;
    }
  }

  async saveRefreshToken(userId: number, token: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: { userId, token, expiresAt },
    });
  }

  async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({ where: { token } });
  }

  async revokeRefreshToken(token: string) {
    return prisma.refreshToken.update({
      where: { token },
      data: { revoked: true },
    });
  }
}
