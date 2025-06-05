import express, { Request } from 'express';
import cookieParser from 'cookie-parser';
import cartRoute from './routes/cart-route';
import logger from '@sharedMiddleware/logger.middleware';
import { auth } from 'express-oauth2-jwt-bearer';
import { config } from 'dotenv';
import errorHandler, {
  notFoundHandler,
} from '@sharedMiddleware/error.middleware';
import { cors, corsOptions } from '@sharedMiddleware/cors.middleware';

config(); // Load environment variables from a .env file into process.env

const app = express();

const jwtCheck = auth({
  audience: 'testnest',
  issuerBaseURL: 'https://dev-hac6cslcusewuy3f.us.auth0.com/',
  tokenSigningAlg: 'RS256',
});

// init middleware
app.use(cors(corsOptions));
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(jwtCheck);

// Extract userId from JWT and attach to req.userId
app.use((req: Request & { auth?: { sub?: string } }, res, next) => {
  // express-oauth2-jwt-bearer puts the JWT payload in req.auth
  if (req.auth && req.auth.sub) {
    req.userId = req.auth.sub;
  }
  next();
});

// Init configuration like DB connection

// Init routes
app.use('/api/cart', cartRoute);

app.use('/api/catalog/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

app.get('/authorized', (req, res) => {
  res.send('Secured Resource');
});

// Catch 404 and forward to error handler
app.use(notFoundHandler);

// Error handling middleware (must be last!)
import type { ErrorRequestHandler } from 'express';

app.use(errorHandler as ErrorRequestHandler);

export default app;
