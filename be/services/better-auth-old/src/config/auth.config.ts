import { AuthConfig } from '@better-auth/core';
import { PrismaAdapter } from '@better-auth/database';

export const config: AuthConfig = {
  // Database adapter
  adapter: PrismaAdapter({
    url: process.env.DATABASE_URL!,
  }),

  // Session configuration
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET!,
    maxAge: 15 * 60, // 15 minutes
  },

  // User model
  user: {
    fields: {
      email: { type: 'email', required: true, unique: true },
      password: { type: 'password', required: true },
      name: { type: 'string', required: false },
    },
  },

  // Authentication methods
  providers: {
    credentials: {
      type: 'credentials',
      authorize: async () => {
        // This will be handled by Better Auth's built-in logic
        return null;
      },
    },
    // OAuth2 Client Credentials flow
    clientCredentials: {
      type: 'oauth2',
      flow: 'client_credentials',
      authorizationUrl: '/auth/oauth/authorize',
      tokenUrl: '/auth/oauth/token',
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      scope: ['read', 'write'],
    },
  },

  // OAuth2 configuration
  oauth2: {
    clients: [
      {
        id: 'cart-service',
        secret: process.env.CART_SERVICE_SECRET || 'cart-secret',
        name: 'Cart Service',
        redirectUris: ['http://localhost:3002/callback'],
        scopes: ['cart:read', 'cart:write'],
      },
      {
        id: 'order-service',
        secret: process.env.ORDER_SERVICE_SECRET || 'order-secret',
        name: 'Order Service',
        redirectUris: ['http://localhost:3003/callback'],
        scopes: ['order:read', 'order:write'],
      },
      {
        id: 'profile-service',
        secret: process.env.PROFILE_SERVICE_SECRET || 'profile-secret',
        name: 'Profile Service',
        redirectUris: ['http://localhost:3004/callback'],
        scopes: ['profile:read', 'profile:write'],
      },
    ],
  },

  // Pages configuration (for web UI if needed)
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },

  // Callbacks
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      if (account) {
        token.clientId = account.clientId;
        token.scope = account.scope;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.clientId = token.clientId;
        session.scope = token.scope;
      }
      return session;
    },
  },
};
