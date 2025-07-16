import { Router } from 'express';
import { AuthController } from '../controller/auth.controller';

const router = Router();
const controller = new AuthController();

router.post('/login', controller.login.bind(controller));
router.post('/register', controller.register.bind(controller));
router.post('/refresh-token', controller.refreshToken.bind(controller));
router.post('/logout', controller.logout.bind(controller));

export default router;
