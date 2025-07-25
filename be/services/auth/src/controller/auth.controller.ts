import { Request, Response } from 'express';
import { AuthService } from '../service/auth.service';

export class AuthController {
  private authService = new AuthService();

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await this.authService.register(email, password);
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { token } = req.body;
      const result = await this.authService.refreshToken(token);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { token } = req.body;
      await this.authService.logout(token);
      res.json({ message: 'Logged out' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
