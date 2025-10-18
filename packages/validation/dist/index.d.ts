import { z } from 'zod';
export declare const userSchema: z.ZodObject<{
    email: z.ZodString;
    display_name: z.ZodOptional<z.ZodString>;
    country_code: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    display_name?: string | undefined;
    country_code?: string | undefined;
}, {
    email: string;
    display_name?: string | undefined;
    country_code?: string | undefined;
}>;
export declare const journalEntrySchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    mood: z.ZodOptional<z.ZodNumber>;
    urge_level: z.ZodOptional<z.ZodNumber>;
    trigger_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    content?: string | undefined;
    mood?: number | undefined;
    urge_level?: number | undefined;
    trigger_ids?: string[] | undefined;
}, {
    title?: string | undefined;
    content?: string | undefined;
    mood?: number | undefined;
    urge_level?: number | undefined;
    trigger_ids?: string[] | undefined;
}>;
export declare const financeTransactionSchema: z.ZodObject<{
    kind: z.ZodEnum<["spend", "save"]>;
    amount_cents: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    note: z.ZodOptional<z.ZodString>;
    occurred_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: "spend" | "save";
    amount_cents: number;
    currency: string;
    occurred_at: string;
    note?: string | undefined;
}, {
    kind: "spend" | "save";
    amount_cents: number;
    occurred_at: string;
    currency?: string | undefined;
    note?: string | undefined;
}>;
export declare const taskSchema: z.ZodObject<{
    title: z.ZodString;
    kind: z.ZodEnum<["breathing", "reframe", "alt_hobby", "exercise", "meditation"]>;
    payload: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    kind: "breathing" | "reframe" | "alt_hobby" | "exercise" | "meditation";
    payload?: Record<string, any> | undefined;
}, {
    title: string;
    kind: "breathing" | "reframe" | "alt_hobby" | "exercise" | "meditation";
    payload?: Record<string, any> | undefined;
}>;
export declare const messageSchema: z.ZodObject<{
    content: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["user", "assistant", "system"]>>;
}, "strip", z.ZodTypeAny, {
    content: string;
    role: "user" | "assistant" | "system";
}, {
    content: string;
    role?: "user" | "assistant" | "system" | undefined;
}>;
export declare const trustedContactSchema: z.ZodObject<{
    name: z.ZodString;
    channel: z.ZodEnum<["sms", "email", "phone"]>;
    value: z.ZodString;
    is_primary: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    value: string;
    name: string;
    channel: "email" | "sms" | "phone";
    is_primary: boolean;
}, {
    value: string;
    name: string;
    channel: "email" | "sms" | "phone";
    is_primary?: boolean | undefined;
}>;
export declare const onboardingSchema: z.ZodObject<{
    frequency: z.ZodEnum<["daily", "weekly", "monthly", "rarely"]>;
    triggers: z.ZodArray<z.ZodString, "many">;
    goals: z.ZodArray<z.ZodString, "many">;
    emergency_contact: z.ZodObject<{
        name: z.ZodString;
        channel: z.ZodEnum<["sms", "email", "phone"]>;
        value: z.ZodString;
        is_primary: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        value: string;
        name: string;
        channel: "email" | "sms" | "phone";
        is_primary: boolean;
    }, {
        value: string;
        name: string;
        channel: "email" | "sms" | "phone";
        is_primary?: boolean | undefined;
    }>;
    country_code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    country_code: string;
    frequency: "daily" | "weekly" | "monthly" | "rarely";
    triggers: string[];
    goals: string[];
    emergency_contact: {
        value: string;
        name: string;
        channel: "email" | "sms" | "phone";
        is_primary: boolean;
    };
}, {
    country_code: string;
    frequency: "daily" | "weekly" | "monthly" | "rarely";
    triggers: string[];
    goals: string[];
    emergency_contact: {
        value: string;
        name: string;
        channel: "email" | "sms" | "phone";
        is_primary?: boolean | undefined;
    };
}>;
export declare const userSettingsSchema: z.ZodObject<{
    timezone: z.ZodDefault<z.ZodString>;
    consent_store_chat: z.ZodDefault<z.ZodBoolean>;
    daily_reminder_hour: z.ZodOptional<z.ZodNumber>;
    crisis_detection: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    timezone: string;
    consent_store_chat: boolean;
    crisis_detection: boolean;
    daily_reminder_hour?: number | undefined;
}, {
    timezone?: string | undefined;
    consent_store_chat?: boolean | undefined;
    daily_reminder_hour?: number | undefined;
    crisis_detection?: boolean | undefined;
}>;
export declare const selfExclusionSchema: z.ZodEffects<z.ZodObject<{
    starts_at: z.ZodString;
    ends_at: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    starts_at: string;
    ends_at: string;
    reason?: string | undefined;
}, {
    starts_at: string;
    ends_at: string;
    reason?: string | undefined;
}>, {
    starts_at: string;
    ends_at: string;
    reason?: string | undefined;
}, {
    starts_at: string;
    ends_at: string;
    reason?: string | undefined;
}>;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
}, {
    page?: number | undefined;
    limit?: number | undefined;
}>;
export declare const dateRangeSchema: z.ZodObject<{
    start_date: z.ZodOptional<z.ZodString>;
    end_date: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    start_date?: string | undefined;
    end_date?: string | undefined;
}, {
    start_date?: string | undefined;
    end_date?: string | undefined;
}>;
//# sourceMappingURL=index.d.ts.map