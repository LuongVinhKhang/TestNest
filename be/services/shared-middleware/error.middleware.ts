import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

// Custom error handler
const errorHandler = (err: Error, req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
    if (err.stack) console.error(err.stack);
  }

  if (process.env.NODE_ENV === 'production') {
    // Optionally log error to external service
  }

  // Handle Auth errors from express-oauth2-jwt-bearer
  if (
    err.status === 401 ||
    err.code === 'invalid_token' ||
    err.name === 'UnauthorizedError'
  ) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or missing token',
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

// Catch 404 and forward to error handler
const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(createHttpError.NotFound('Not Found'));
};

export { notFoundHandler };
export default errorHandler;
