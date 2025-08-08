import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { auth } from './auth';
import { toExpressHandler } from 'better-auth/express';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount Better Auth routes
app.use('/api/auth', toExpressHandler(auth));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'better-auth-v2',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth/*',
      health: '/health',
    },
  });
});

// Start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Better Auth v2 service listening on port ${port}`);
  console.log(`Auth endpoints available at http://localhost:${port}/api/auth`);
  console.log(`Health check: http://localhost:${port}/health`);
});

export default app;
