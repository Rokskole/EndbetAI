import { Router, Response } from 'express';
import { asyncHandler, createValidationError } from '../../middleware/errorHandler';
import { authenticateSession, AuthenticatedRequest } from '../../middleware/auth';
import { DatabaseService } from '../../lib/supabase';
import { JournalEntry, ApiResponse } from '@packages/types';
import { journalEntrySchema } from '@packages/validation';

const router = Router();

// Journal routes
router.get('/', authenticateSession, asyncHandler(async (req: AuthenticatedRequest, res: Response<ApiResponse<JournalEntry[]>>) => {
  const page = parseInt((req.query.page as string) || '1');
  const limit = parseInt((req.query.limit as string) || '20');
  const offset = (page - 1) * limit;

  const entries = await DatabaseService.getJournalEntries(req.user!.id, limit, offset);
  res.json({ success: true, data: entries });
}));

router.post('/', authenticateSession, asyncHandler(async (req: AuthenticatedRequest, res: Response<ApiResponse<JournalEntry>>) => {
  const parsed = journalEntrySchema.safeParse(req.body);
  if (!parsed.success) throw createValidationError('Invalid journal entry');

  const entry = await DatabaseService.createJournalEntry({
    user_id: req.user!.id,
    title: parsed.data.title,
    content: parsed.data.content,
    mood: parsed.data.mood,
    urge_level: parsed.data.urge_level,
  });

  res.json({ success: true, data: entry });
}));

export { router as journalRouter };
