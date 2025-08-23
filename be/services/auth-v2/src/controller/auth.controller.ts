import { Request, Response } from 'express';
import { AuthService } from '../service/auth.service';

const authService = new AuthService();

interface JwtPayload {
  sub: number;
  email?: string;
  iat?: number;
  exp?: number;
}

export class AuthController {
  async register(req: Request, res: Response) {
    const { email, password, name } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });
    try {
      const user = await authService.register(email, password, name);
      res.status(201).json({ id: user.id, email: user.email, name: user.name });
    } catch {
      res.status(400).json({ message: 'User already exists' });
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await authService.validateUser(email, password);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = authService.signJwt(
      { sub: user.id, email: user.email },
      { expiresIn: '15m' },
    );
    const refreshToken = authService.signJwt(
      { sub: user.id },
      { expiresIn: '7d' },
    );
    await authService.saveRefreshToken(
      user.id,
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );
    res.json({ accessToken, refreshToken });
  }

  async refreshToken(req: Request, res: Response) {
    const { token: refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: 'Refresh token required' });
    const payload = authService.verifyJwt(refreshToken) as JwtPayload | null;
    if (!payload)
      return res.status(401).json({ message: 'Invalid refresh token' });

    const tokenRecord = await authService.findRefreshToken(refreshToken);
    if (!tokenRecord || tokenRecord.revoked)
      return res.status(401).json({ message: 'Refresh token revoked' });

    const accessToken = authService.signJwt(
      { sub: payload.sub, email: payload.email },
      { expiresIn: '15m' },
    );
    res.json({ accessToken });
  }

  async logout(req: Request, res: Response) {
    const { token: refreshToken } = req.body;
    if (refreshToken) await authService.revokeRefreshToken(refreshToken);
    res.json({ message: 'Logged out' });
  }
}
