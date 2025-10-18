"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateRangeSchema = exports.paginationSchema = exports.selfExclusionSchema = exports.userSettingsSchema = exports.onboardingSchema = exports.trustedContactSchema = exports.messageSchema = exports.taskSchema = exports.financeTransactionSchema = exports.journalEntrySchema = exports.userSchema = void 0;
const zod_1 = require("zod");
// User validation
exports.userSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    display_name: zod_1.z.string().optional(),
    country_code: zod_1.z.string().length(2).optional(),
});
// Journal validation
exports.journalEntrySchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    content: zod_1.z.string().optional(),
    mood: zod_1.z.number().min(-5).max(5).optional(),
    urge_level: zod_1.z.number().min(0).max(10).optional(),
    trigger_ids: zod_1.z.array(zod_1.z.string().uuid()).optional(),
});
// Finance validation
exports.financeTransactionSchema = zod_1.z.object({
    kind: zod_1.z.enum(['spend', 'save']),
    amount_cents: zod_1.z.number().int().min(0),
    currency: zod_1.z.string().length(3).default('USD'),
    note: zod_1.z.string().optional(),
    occurred_at: zod_1.z.string().datetime(),
});
// Task validation
exports.taskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200),
    kind: zod_1.z.enum(['breathing', 'reframe', 'alt_hobby', 'exercise', 'meditation']),
    payload: zod_1.z.record(zod_1.z.any()).optional(),
});
// Message validation
exports.messageSchema = zod_1.z.object({
    content: zod_1.z.string().min(1).max(2000),
    role: zod_1.z.enum(['user', 'assistant', 'system']).default('user'),
});
// Trusted contact validation
exports.trustedContactSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    channel: zod_1.z.enum(['sms', 'email', 'phone']),
    value: zod_1.z.string().min(1).max(100),
    is_primary: zod_1.z.boolean().default(false),
});
// Onboarding validation
exports.onboardingSchema = zod_1.z.object({
    frequency: zod_1.z.enum(['daily', 'weekly', 'monthly', 'rarely']),
    triggers: zod_1.z.array(zod_1.z.string()).min(1),
    goals: zod_1.z.array(zod_1.z.string()).min(1),
    emergency_contact: exports.trustedContactSchema,
    country_code: zod_1.z.string().length(2),
});
// Settings validation
exports.userSettingsSchema = zod_1.z.object({
    timezone: zod_1.z.string().default('UTC'),
    consent_store_chat: zod_1.z.boolean().default(false),
    daily_reminder_hour: zod_1.z.number().min(0).max(23).optional(),
    crisis_detection: zod_1.z.boolean().default(true),
});
// Self-exclusion validation
exports.selfExclusionSchema = zod_1.z.object({
    starts_at: zod_1.z.string().datetime(),
    ends_at: zod_1.z.string().datetime(),
    reason: zod_1.z.string().optional(),
}).refine(data => new Date(data.ends_at) > new Date(data.starts_at), {
    message: "End date must be after start date",
});
// Query parameters validation
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
exports.dateRangeSchema = zod_1.z.object({
    start_date: zod_1.z.string().datetime().optional(),
    end_date: zod_1.z.string().datetime().optional(),
});
// All schemas are already exported above
//# sourceMappingURL=index.js.map