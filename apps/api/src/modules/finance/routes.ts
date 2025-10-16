import { Router, Response } from 'express';
import { asyncHandler, createValidationError } from '../../middleware/errorHandler';
import { authenticateSession, AuthenticatedRequest } from '../../middleware/auth';
import { financeTransactionSchema } from '@packages/validation';
import { DatabaseService } from '../../lib/supabase';
import { FinanceTransaction, ApiResponse, PaginatedResponse } from '@packages/types';

const router = Router();

// Finance routes
router.get('/transactions', authenticateSession, asyncHandler(async (req: AuthenticatedRequest, res: Response<PaginatedResponse<FinanceTransaction>>) => {
  const page = parseInt((req.query.page as string) || '1');
  const limit = parseInt((req.query.limit as string) || '20');
  const offset = (page - 1) * limit;

  const txs = await DatabaseService.getFinanceTransactions(req.user!.id, limit, offset);
  
  res.json({ 
    success: true, 
    data: txs,
    pagination: {
      page,
      limit,
      total: txs.length,
      total_pages: Math.ceil(txs.length / limit)
    }
  });
}));

router.post('/transactions', authenticateSession, asyncHandler(async (req: AuthenticatedRequest, res: Response<ApiResponse<FinanceTransaction>>) => {
  const parsed = financeTransactionSchema.safeParse(req.body);
  if (!parsed.success) throw createValidationError('Invalid finance transaction');

  const tx = await DatabaseService.createFinanceTransaction({
    user_id: req.user!.id,
    kind: parsed.data.kind,
    amount_cents: parsed.data.amount_cents,
    currency: parsed.data.currency,
    note: parsed.data.note,
    occurred_at: parsed.data.occurred_at,
  });
  res.json({ success: true, data: tx });
}));

router.get('/summary', authenticateSession, asyncHandler(async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  // naive summary: sum by kind
  const txs = await DatabaseService.getFinanceTransactions(req.user!.id, 1000, 0);
  const summary = txs.reduce((acc: any, tx: any) => {
    if (tx.kind === 'spend') acc.total_spent += tx.amount_cents;
    if (tx.kind === 'save') acc.total_saved += tx.amount_cents;
    return acc;
  }, { total_spent: 0, total_saved: 0, balance: 0 });
  summary.balance = summary.total_saved - summary.total_spent;
  res.json({ success: true, data: summary });
}));

export { router as financeRouter };
