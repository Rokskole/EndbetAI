import { Request, Response } from 'express';
import { ApiResponse, User } from '@packages/types';
import { userSchema } from '@packages/validation';
import { supabase, supabaseAdmin, DatabaseService } from '../../lib/supabase';
import { createError, createValidationError } from '../../middleware/errorHandler';
import { AuthenticatedRequest } from '../../middleware/auth';

export const authController = {
  // Send magic link for email authentication
  sendMagicLink: async (req: Request, res: Response<ApiResponse>) => {
    const { email } = req.body;

    if (!email) {
      throw createValidationError('Email is required');
    }

    // Validate email format
    const validation = userSchema.pick({ email: true }).safeParse({ email });
    if (!validation.success) {
      throw createValidationError('Invalid email format');
    }

    try {
      // Debug: Log environment variables
      console.log('Supabase URL:', process.env.SUPABASE_URL);
      console.log('Supabase Anon Key:', process.env.SUPABASE_ANON_KEY ? 'Set' : 'Not set');
      console.log('Supabase Service Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set');
      
      // Send magic link via Supabase Auth
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/callback`,
        },
      });

      if (error) {
        console.error('Supabase error:', error);
        throw createError('Failed to send magic link', 400);
      }

      res.json({
        success: true,
        message: 'Magic link sent to your email',
      });
    } catch (error) {
      throw createError('Failed to send magic link', 500);
    }
  },

  // Verify magic link and create/update user
  verifyMagicLink: async (req: Request, res: Response<ApiResponse<{ user: User; session: any }>>) => {
    const { token_hash, type, email } = req.body;

    if (!token_hash || !type || !email) {
      throw createValidationError('Missing required parameters');
    }

    try {
      // Verify the token with Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash,
        type: type as any,
      });

      if (error || !data.user) {
        throw createError('Invalid or expired token', 401);
      }

      // Check if user exists in our database
      let user = await DatabaseService.getUserByEmail(email);
      
      if (!user) {
        // Create new user
        user = await DatabaseService.createUser({
          email: data.user.email!,
          display_name: data.user.user_metadata?.display_name,
          country_code: data.user.user_metadata?.country_code,
        });
      }

      // Create session
      const { data: sessionData, error: sessionError } = await supabaseAdmin
        .from('sessions')
        .insert({
          user_id: user.id,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        })
        .select()
        .single();

      if (sessionError) {
        throw createError('Failed to create session', 500);
      }

      res.json({
        success: true,
        data: {
          user,
          session: sessionData,
        },
        message: 'Authentication successful',
      });
    } catch (error) {
      throw createError('Failed to verify magic link', 500);
    }
  },

  // Logout user
  logout: async (req: Request, res: Response<ApiResponse>) => {
    const { sessionId } = req.body;

    if (!sessionId) {
      throw createValidationError('Session ID is required');
    }

    try {
      // Delete session from database
      const { error } = await supabaseAdmin
        .from('sessions')
        .delete()
        .eq('id', sessionId);

      if (error) {
        throw createError('Failed to logout', 500);
      }

      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      throw createError('Failed to logout', 500);
    }
  },

  // Get current user
  getCurrentUser: async (req: AuthenticatedRequest, res: Response<ApiResponse<User>>) => {
    if (!req.user) {
      throw createError('User not authenticated', 401);
    }

    res.json({
      success: true,
      data: req.user,
    });
  },

  // Refresh session
  refreshSession: async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    if (!req.sessionId) {
      throw createError('Session ID not found', 401);
    }

    try {
      // Extend session by 7 days
      const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      
      const { error } = await supabaseAdmin
        .from('sessions')
        .update({ expires_at: newExpiresAt })
        .eq('id', req.sessionId);

      if (error) {
        throw createError('Failed to refresh session', 500);
      }

      res.json({
        success: true,
        message: 'Session refreshed successfully',
      });
    } catch (error) {
      throw createError('Failed to refresh session', 500);
    }
  },
};
