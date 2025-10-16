import { Router, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import { authenticateSession, AuthenticatedRequest } from '../../middleware/auth';
import { supabaseAdmin } from '../../lib/supabase';
import { User, UserSettings, ApiResponse } from '@packages/types';

const router = Router();

// User routes
router.get('/profile', authenticateSession, asyncHandler(async (req: AuthenticatedRequest, res: Response<ApiResponse<User>>) => {
  res.json({ success: true, data: req.user });
}));

router.put('/profile', authenticateSession, asyncHandler(async (req: AuthenticatedRequest, res: Response<ApiResponse<User>>) => {
  // Minimal profile update: display_name, country_code
  const { display_name, country_code } = req.body || {};
  const { data, error } = await supabaseAdmin
    .from('users')
    .update({ display_name, country_code })
    .eq('id', req.user!.id)
    .select()
    .single();
  if (error) throw error;
  res.json({ success: true, data });
}));

router.get('/settings', authenticateSession, asyncHandler(async (req: AuthenticatedRequest, res: Response<ApiResponse<UserSettings>>) => {
  const { data, error } = await supabaseAdmin
    .from('user_settings')
    .select('*')
    .eq('user_id', req.user!.id)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  res.json({ success: true, data: data || null });
}));

router.put('/settings', authenticateSession, asyncHandler(async (req: AuthenticatedRequest, res: Response<ApiResponse<UserSettings>>) => {
  const { timezone, consent_store_chat, daily_reminder_hour, crisis_detection } = req.body || {};
  const { data, error } = await supabaseAdmin
    .from('user_settings')
    .upsert({
      user_id: req.user!.id,
      timezone,
      consent_store_chat,
      daily_reminder_hour,
      crisis_detection,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  res.json({ success: true, data });
}));

// Dashboard summary
router.get('/summary', authenticateSession, asyncHandler(async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  const userId = req.user!.id;
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [tasksResp, journalResp, txResp] = await Promise.all([
    supabaseAdmin.from('task_completions').select('id,completed_at').eq('user_id', userId).gte('completed_at', since),
    supabaseAdmin.from('journal_entries').select('id,created_at,mood,urge_level').eq('user_id', userId).gte('created_at', since),
    supabaseAdmin.from('finance_transactions').select('id,kind,amount_cents,occurred_at').eq('user_id', userId).gte('occurred_at', since),
  ]);

  if (tasksResp.error) throw tasksResp.error;
  if (journalResp.error) throw journalResp.error;
  if (txResp.error) throw txResp.error;

  const tasksCompleted7d = tasksResp.data?.length || 0;
  const journalCount7d = journalResp.data?.length || 0;
  const totals = (txResp.data || []).reduce((acc: any, t: any) => {
    if (t.kind === 'spend') acc.total_spent += t.amount_cents; else if (t.kind === 'save') acc.total_saved += t.amount_cents;
    return acc;
  }, { total_spent: 0, total_saved: 0 });
  const balance = totals.total_saved - totals.total_spent;

  // simple daily goal suggestion
  const daily_goal = tasksCompleted7d >= 3 ? 'Maintain streak with 1 grounding exercise' : 'Complete 1 breathing exercise';

  res.json({
    success: true,
    data: {
      daily_goal,
      tasksCompleted7d,
      journalCount7d,
      finance: { total_spent: totals.total_spent, total_saved: totals.total_saved, balance },
    },
  });
}));

export { router as usersRouter };
