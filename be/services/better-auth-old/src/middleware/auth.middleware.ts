import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  client?: {
    id: string;
    name: string;
    scope: string[];
  };
}

export class AuthMiddleware {
  // Validate OAuth2 client credentials token
  static validateClientToken(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          error: 'unauthorized',
          message: 'No token provided',
        });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as unknown;

      // Check if token is for client credentials (not user token)
      if (!decoded.client_id) {
        return res.status(401).json({
          error: 'invalid_token',
          message: 'Token is not a client credentials token',
        });
      }

      // Attach client info to request
      req.client = {
        id: decoded.client_id,
        name: decoded.client_name,
        scope: decoded.scope ? decoded.scope.split(' ') : [],
      };

      next();
    } catch {
      return res.status(401).json({
        error: 'invalid_token',
        message: 'Invalid or expired token',
      });
    }
  }

  // Check if client has required scope
  static requireScope(requiredScope: string) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (!req.client) {
        return res.status(401).json({
          error: 'unauthorized',
          message: 'No client information found',
        });
      }

      if (!req.client.scope.includes(requiredScope)) {
        return res.status(403).json({
          error: 'insufficient_scope',
          message: `Required scope: ${requiredScope}`,
        });
      }

      next();
    };
  }

  // Check if client has any of the required scopes
  static requireAnyScope(requiredScopes: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (!req.client) {
        return res.status(401).json({
          error: 'unauthorized',
          message: 'No client information found',
        });
      }

      const hasRequiredScope = requiredScopes.some((scope) =>
        req.client!.scope.includes(scope),
      );

      if (!hasRequiredScope) {
        return res.status(403).json({
          error: 'insufficient_scope',
          message: `Required scopes: ${requiredScopes.join(', ')}`,
        });
      }

      next();
    };
  }
}
