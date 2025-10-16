import { Router, Response } from 'express';
import { asyncHandler, createValidationError } from '../../middleware/errorHandler';
import { authenticateSession, AuthenticatedRequest } from '../../middleware/auth';
import { DatabaseService, supabaseAdmin } from '../../lib/supabase';
import { messageSchema } from '@packages/validation';
import { generateAssistantReply, detectCrisisAndUrge, generateCrisisResponse } from '../../lib/ai';
import { ApiResponse, Message } from '@packages/types';

const router = Router();

// Chat routes
router.get('/messages', authenticateSession, asyncHandler(async (req: AuthenticatedRequest, res: Response<ApiResponse<Message[]>>) => {
  const limit = parseInt((req.query.limit as string) || '50');
  const messages = await DatabaseService.getMessages(req.user!.id, limit);
  res.json({ success: true, data: messages });
}));

router.post('/messages', authenticateSession, asyncHandler(async (req: AuthenticatedRequest, res: Response<ApiResponse<Message>>) => {
  const parsed = messageSchema.pick({ content: true }).safeParse(req.body);
  if (!parsed.success) throw createValidationError('Invalid message');

  const userMessage = await DatabaseService.createMessage({
    user_id: req.user!.id,
    role: 'user',
    content: parsed.data.content,
  });

  // Crisis detection
  const detection = detectCrisisAndUrge(parsed.data.content);
  
  // Create SOS event if crisis detected
  if (detection.isCrisis) {
    await supabaseAdmin.from('sos_events').insert({
      user_id: req.user!.id,
      source: 'detector',
      level: 'crisis',
      resolution: 'crisis_detected',
      meta: { detected_keywords: detection.detectedKeywords }
    });
  } else if (detection.isUrge) {
    await supabaseAdmin.from('sos_events').insert({
      user_id: req.user!.id,
      source: 'detector',
      level: 'urge',
      resolution: 'urge_detected',
      meta: { detected_keywords: detection.detectedKeywords }
    });
  }

  // Generate appropriate response
  let replyText: string;
  
  if (detection.isCrisis || detection.isUrge) {
    replyText = generateCrisisResponse(detection, parsed.data.content);
  } else {
    // Generate normal AI response
    const history = await DatabaseService.getMessages(req.user!.id, 10);
    const messages = [
      { role: 'system', content: 'You are a compassionate recovery coach using CBT and motivational interviewing. Be supportive, non-judgmental, and focus on practical recovery strategies.' },
      ...history.reverse().map((m: any) => ({ role: m.role, content: m.content })),
    ];
    replyText = await generateAssistantReply(messages as any);
  }

  const assistantMessage = await DatabaseService.createMessage({
    user_id: req.user!.id,
    role: 'assistant',
    content: replyText,
  });

  res.json({ 
    success: true, 
    data: assistantMessage
  });
}));

router.post('/analyze', authenticateSession, asyncHandler(async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  const parsed = messageSchema.pick({ content: true }).safeParse(req.body);
  if (!parsed.success) throw createValidationError('Invalid message');
  
  const detection = detectCrisisAndUrge(parsed.data.content);
  
  res.json({ 
    success: true, 
    data: {
      isCrisis: detection.isCrisis,
      isUrge: detection.isUrge,
      riskLevel: detection.riskLevel,
      detectedKeywords: detection.detectedKeywords,
      suggestedAction: detection.suggestedAction
    }
  });
}));

export { router as chatRouter };
