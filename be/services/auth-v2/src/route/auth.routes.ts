import { Router } from 'express';
import { AuthController } from '../controller/auth.controller';

const router = Router();
const controller = new AuthController();

router.post('/login', (req, res) => controller.login(req, res));
router.post('/register', (req, res) => controller.register(req, res));
router.post('/refresh-token', (req, res) => controller.refreshToken(req, res));
router.post('/logout', (req, res) => controller.logout(req, res));

export default router;
