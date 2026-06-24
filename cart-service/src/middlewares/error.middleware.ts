import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../config/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.error(`[AppError] ${err.statusCode} - ${err.message}`);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  logger.error(`[UnhandledError] ${err.message}`, { stack: err.stack });
  
  const statusCode = 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;
  
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
