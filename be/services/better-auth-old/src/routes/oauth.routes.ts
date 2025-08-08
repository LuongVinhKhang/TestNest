import { Router } from 'express';
import { OAuthController } from '../controllers/oauth.controller';

const router = Router();
const controller = new OAuthController();

// OAuth2 Client Credentials Flow
router.post('/token', (req, res) => controller.getClientToken(req, res));

// Token validation endpoint
router.post('/validate', (req, res) => controller.validateToken(req, res));

// Get client information
router.get('/clients/:client_id', (req, res) =>
  controller.getClientInfo(req, res),
);

export default router;
