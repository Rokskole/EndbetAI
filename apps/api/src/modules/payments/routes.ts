import { Router, Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import { authenticateSession } from '../../middleware/auth';
import { paymentsController } from './controller';
import express from 'express';

const router = Router();

// Stripe webhook - must be before body parsing middleware
// This route should not use authenticateSession since Stripe sends raw body
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  (req: Request, res: Response, next: NextFunction) => {
    // Wrap in async handler for webhook
    Promise.resolve(paymentsController.handleWebhook(req as any, res, next)).catch(next);
  }
);

// Public routes (no auth required)
router.get('/products', asyncHandler(paymentsController.getProducts));

// Protected routes (require authentication)
router.post(
  '/create-intent',
  authenticateSession,
  asyncHandler(paymentsController.createIntent)
);
router.post(
  '/verify-iap',
  authenticateSession,
  asyncHandler(paymentsController.verifyIAP)
);
router.get(
  '/premium-status',
  authenticateSession,
  asyncHandler(paymentsController.getPremiumStatus)
);
router.get(
  '/subscription-status',
  authenticateSession,
  asyncHandler(paymentsController.getSubscriptionStatus)
);

export { router as paymentsRouter };

