import { Router, Response } from 'express';
import { asyncHandler, createValidationError } from '../../middleware/errorHandler';
import { authenticateSession, AuthenticatedRequest } from '../../middleware/auth';
import { taskSchema } from '@packages/validation';
import { DatabaseService, supabaseAdmin } from '../../lib/supabase';
import { Task, ApiResponse } from '@packages/types';

const router = Router();

// Task routes
router.get('/', authenticateSession, asyncHandler(async (req: AuthenticatedRequest, res: Response<ApiResponse<Task[]>>) => {
  const tasks = await DatabaseService.getTasks(req.user!.id, false);
  res.json({ success: true, data: tasks });
}));

router.post('/', authenticateSession, asyncHandler(async (req: AuthenticatedRequest, res: Response<ApiResponse<Task>>) => {
  const parsed = taskSchema.safeParse(req.body);
  if (!parsed.success) throw createValidationError('Invalid task');

  const task = await DatabaseService.createTask({
    user_id: req.user!.id,
    title: parsed.data.title,
    kind: parsed.data.kind,
    payload: parsed.data.payload,
  });
  res.json({ success: true, data: task });
}));

router.post('/:id/complete', authenticateSession, asyncHandler(async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  const { id } = req.params;
  const { rating, notes } = req.body || {};
  const { data, error } = await supabaseAdmin
    .from('task_completions')
    .insert({ task_id: id, user_id: req.user!.id, rating, notes })
    .select()
    .single();
  if (error) throw error;
  res.json({ success: true, data });
}));

export { router as tasksRouter };
