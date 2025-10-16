import { Router, Response } from 'express';
import { asyncHandler, createValidationError } from '../../middleware/errorHandler';
import { authenticateSession, AuthenticatedRequest } from '../../middleware/auth';
import { supabaseAdmin } from '../../lib/supabase';
import { helplines } from '@packages/config';
import { ApiResponse, SosEvent, TrustedContact, Helpline } from '@packages/types';

const router = Router();

// SOS routes
router.post('/trigger', authenticateSession, asyncHandler(async (req: AuthenticatedRequest, res: Response<ApiResponse<SosEvent>>) => {
  const { level, source } = req.body || {};
  if (!level || !source) throw createValidationError('Missing level or source');
  const { data, error } = await supabaseAdmin
    .from('sos_events')
    .insert({ user_id: req.user!.id, level, source })
    .select()
    .single();
  if (error) throw error;
  res.json({ success: true, data });
}));

router.get('/helplines', authenticateSession, asyncHandler(async (req: AuthenticatedRequest, res: Response<ApiResponse<Helpline[]>>) => {
  const country = req.user?.country_code || 'US';
  const list = (helplines as any)[country] || (helplines as any)['US'] || [];
  res.json({ success: true, data: list });
}));

router.get('/contacts', authenticateSession, asyncHandler(async (req: AuthenticatedRequest, res: Response<ApiResponse<TrustedContact[]>>) => {
  const { data, error } = await supabaseAdmin
    .from('trusted_contacts')
    .select('*')
    .eq('user_id', req.user!.id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  res.json({ success: true, data });
}));

router.post('/contacts', authenticateSession, asyncHandler(async (req: AuthenticatedRequest, res: Response<ApiResponse<TrustedContact>>) => {
  const { name, channel, value, is_primary } = req.body || {};
  if (!name || !channel || !value) throw createValidationError('Missing contact fields');
  const { data, error } = await supabaseAdmin
    .from('trusted_contacts')
    .insert({ user_id: req.user!.id, name, channel, value, is_primary })
    .select()
    .single();
  if (error) throw error;
  res.json({ success: true, data });
}));

export { router as sosRouter };
