# Better Auth v2 Service

This is the v2 authentication service using the [Better Auth](https://github.com/better-auth/better-auth) framework.

## Features

- Modern authentication framework
- JWT-based sessions
- User registration and login
- Session management
- Extensible with plugins

## Setup

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.sample .env
   # Edit .env with your values
   ```

3. **Set up database:**

   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

4. **Start the service:**
   ```bash
   pnpm dev
   ```

## Endpoints

- `GET /health` - Health check
- `POST /auth/signup` - Register new user
- `POST /auth/signin` - Login
- `GET /auth/session` - Get current session
- `POST /auth/signout` - Logout

## Migration from v1

This service runs alongside the original auth service (v1) on port 3001, while v1 runs on port 3000.

### Testing

Use the `rest.http` file to test the endpoints.

### Integration

To integrate with other services, update the auth service URL:

```typescript
// For v1
const AUTH_URL = 'http://localhost:3000';

// For v2
const AUTH_URL = 'http://localhost:3001';
```
