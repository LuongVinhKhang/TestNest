import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface OAuthClient {
  id: string;
  secret: string;
  name: string;
  scopes: string[];
}

// OAuth clients configuration
const OAUTH_CLIENTS: OAuthClient[] = [
  {
    id: 'cart-service',
    secret: process.env.CART_SERVICE_SECRET || 'cart-secret',
    name: 'Cart Service',
    scopes: ['cart:read', 'cart:write'],
  },
  {
    id: 'order-service',
    secret: process.env.ORDER_SERVICE_SECRET || 'order-secret',
    name: 'Order Service',
    scopes: ['order:read', 'order:write'],
  },
  {
    id: 'profile-service',
    secret: process.env.PROFILE_SERVICE_SECRET || 'profile-secret',
    name: 'Profile Service',
    scopes: ['profile:read', 'profile:write'],
  },
];

export class OAuthController {
  // Client Credentials Flow - for service-to-service authentication
  async getClientToken(req: Request, res: Response) {
    try {
      const { client_id, client_secret, grant_type, scope } = req.body;

      // Validate required fields
      if (!client_id || !client_secret || grant_type !== 'client_credentials') {
        return res.status(400).json({
          error: 'invalid_request',
          error_description: 'Missing required parameters',
        });
      }

      // Find the client
      const client = OAUTH_CLIENTS.find((c) => c.id === client_id);
      if (!client || client.secret !== client_secret) {
        return res.status(401).json({
          error: 'invalid_client',
          error_description: 'Invalid client credentials',
        });
      }

      // Generate access token
      const accessToken = jwt.sign(
        {
          client_id: client.id,
          client_name: client.name,
          scope: scope || client.scopes.join(' '),
          token_type: 'Bearer',
        },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' },
      );

      // Return token response
      res.json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 3600, // 1 hour
        scope: scope || client.scopes.join(' '),
      });
    } catch {
      res.status(500).json({
        error: 'server_error',
        error_description: 'Internal server error',
      });
    }
  }

  // Validate token endpoint
  async validateToken(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          error: 'invalid_token',
          error_description: 'No token provided',
        });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as unknown;

      res.json({
        valid: true,
        client_id: decoded.client_id,
        client_name: decoded.client_name,
        scope: decoded.scope,
        exp: decoded.exp,
      });
    } catch {
      res.status(401).json({
        error: 'invalid_token',
        error_description: 'Invalid or expired token',
      });
    }
  }

  // Get client info
  async getClientInfo(req: Request, res: Response) {
    try {
      const { client_id } = req.params;
      const client = OAUTH_CLIENTS.find((c) => c.id === client_id);

      if (!client) {
        return res.status(404).json({
          error: 'client_not_found',
          error_description: 'Client not found',
        });
      }

      res.json({
        client_id: client.id,
        client_name: client.name,
        scopes: client.scopes,
      });
    } catch {
      res.status(500).json({
        error: 'server_error',
        error_description: 'Internal server error',
      });
    }
  }
}
