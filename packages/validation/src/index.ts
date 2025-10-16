import { z } from 'zod';

// User validation
export const userSchema = z.object({
  email: z.string().email(),
  display_name: z.string().optional(),
  country_code: z.string().length(2).optional(),
});

// Journal validation
export const journalEntrySchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  mood: z.number().min(-5).max(5).optional(),
  urge_level: z.number().min(0).max(10).optional(),
  trigger_ids: z.array(z.string().uuid()).optional(),
});

// Finance validation
export const financeTransactionSchema = z.object({
  kind: z.enum(['spend', 'save']),
  amount_cents: z.number().int().min(0),
  currency: z.string().length(3).default('USD'),
  note: z.string().optional(),
  occurred_at: z.string().datetime(),
});

// Task validation
export const taskSchema = z.object({
  title: z.string().min(1).max(200),
  kind: z.enum(['breathing', 'reframe', 'alt_hobby', 'exercise', 'meditation']),
  payload: z.record(z.any()).optional(),
});

// Message validation
export const messageSchema = z.object({
  content: z.string().min(1).max(2000),
  role: z.enum(['user', 'assistant', 'system']).default('user'),
});

// Trusted contact validation
export const trustedContactSchema = z.object({
  name: z.string().min(1).max(100),
  channel: z.enum(['sms', 'email', 'phone']),
  value: z.string().min(1).max(100),
  is_primary: z.boolean().default(false),
});

// Onboarding validation
export const onboardingSchema = z.object({
  frequency: z.enum(['daily', 'weekly', 'monthly', 'rarely']),
  triggers: z.array(z.string()).min(1),
  goals: z.array(z.string()).min(1),
  emergency_contact: trustedContactSchema,
  country_code: z.string().length(2),
});

// Settings validation
export const userSettingsSchema = z.object({
  timezone: z.string().default('UTC'),
  consent_store_chat: z.boolean().default(false),
  daily_reminder_hour: z.number().min(0).max(23).optional(),
  crisis_detection: z.boolean().default(true),
});

// Self-exclusion validation
export const selfExclusionSchema = z.object({
  starts_at: z.string().datetime(),
  ends_at: z.string().datetime(),
  reason: z.string().optional(),
}).refine(data => new Date(data.ends_at) > new Date(data.starts_at), {
  message: "End date must be after start date",
});

// Query parameters validation
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const dateRangeSchema = z.object({
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
});

// All schemas are already exported above
