import { Router } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import { authenticateSession } from '../../middleware/auth';
import { authController } from './controller';

const router = Router();

// Public auth routes
router.post('/login', asyncHandler(authController.sendMagicLink));
router.post('/verify', asyncHandler(authController.verifyMagicLink));

// Protected auth routes
router.post('/logout', authenticateSession, asyncHandler(authController.logout));
router.get('/me', authenticateSession, asyncHandler(authController.getCurrentUser));
router.post('/refresh', authenticateSession, asyncHandler(authController.refreshSession));

export { router as authRouter };
