import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin, DatabaseService } from '../lib/supabase';
import { createUnauthorizedError, createError } from './errorHandler';
import { User } from '@packages/types';

export interface AuthenticatedRequest extends Request {
  user?: User;
  sessionId?: string;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw createUnauthorizedError('Access token required');
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      throw createUnauthorizedError('Invalid or expired token');
    }

    // Get user data from our database
    const userData = await DatabaseService.getUserByEmail(user.email!);
    if (!userData) {
      throw createUnauthorizedError('User not found');
    }

    req.user = userData;
    next();
  } catch (error) {
    next(error);
  }
};

export const authenticateSession = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = req.headers['x-session-id'] as string;

    if (!sessionId) {
      throw createUnauthorizedError('Session ID required');
    }

    // Verify session exists and is not expired
    const { data: session, error } = await supabaseAdmin
      .from('sessions')
      .select('*, users(*)')
      .eq('id', sessionId)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !session) {
      throw createUnauthorizedError('Invalid or expired session');
    }

    req.user = session.users;
    req.sessionId = sessionId;
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
      
      if (!error && user) {
        const userData = await DatabaseService.getUserByEmail(user.email!);
        if (userData) {
          req.user = userData;
        }
      }
    }

    next();
  } catch (error) {
    // For optional auth, we don't throw errors, just continue
    next();
  }
};
