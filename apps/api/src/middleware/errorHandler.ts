import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@packages/types';
import { config } from '@packages/config';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  let { statusCode = 500, message } = error;

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (error.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden';
  } else if (error.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Resource not found';
  } else if (error.name === 'ConflictError') {
    statusCode = 409;
    message = 'Resource conflict';
  }

  // Log error details
  console.error('Error:', {
    message: error.message,
    statusCode,
    stack: config.development.isDev ? error.stack : undefined,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    message: config.development.isDev ? error.message : 'An error occurred',
    ...(config.development.isDev && { stack: error.stack }),
  });
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Common error creators
export const createError = (message: string, statusCode: number = 500) => {
  return new CustomError(message, statusCode);
};

export const createValidationError = (message: string) => {
  return new CustomError(message, 400);
};

export const createUnauthorizedError = (message: string = 'Unauthorized') => {
  return new CustomError(message, 401);
};

export const createForbiddenError = (message: string = 'Forbidden') => {
  return new CustomError(message, 403);
};

export const createNotFoundError = (message: string = 'Resource not found') => {
  return new CustomError(message, 404);
};

export const createConflictError = (message: string = 'Resource conflict') => {
  return new CustomError(message, 409);
};
