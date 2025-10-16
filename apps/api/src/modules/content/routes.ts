import { Router, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import { authenticateSession, AuthenticatedRequest } from '../../middleware/auth';
import { supabaseAdmin } from '../../lib/supabase';
import { ContentItem, ApiResponse } from '@packages/types';

const router = Router();

// Content routes
router.get('/articles', authenticateSession, asyncHandler(async (req: AuthenticatedRequest, res: Response<ApiResponse<ContentItem[]>>) => {
  const { data, error } = await supabaseAdmin
    .from('content_items')
    .select('*')
    .eq('kind', 'article')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  res.json({ success: true, data });
}));

router.get('/guides', authenticateSession, asyncHandler(async (req: AuthenticatedRequest, res: Response<ApiResponse<ContentItem[]>>) => {
  const { data, error } = await supabaseAdmin
    .from('content_items')
    .select('*')
    .eq('kind', 'guide')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  res.json({ success: true, data });
}));

router.get('/search', authenticateSession, asyncHandler(async (req: AuthenticatedRequest, res: Response<ApiResponse<ContentItem[]>>) => {
  const q = (req.query.q as string) || '';
  const { data, error } = await supabaseAdmin
    .from('content_items')
    .select('*')
    .ilike('title', `%${q}%`)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  res.json({ success: true, data });
}));

export { router as contentRouter };
