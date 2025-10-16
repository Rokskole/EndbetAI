// Core types
export interface User {
  id: string;
  email: string;
  display_name?: string;
  country_code?: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  created_at: string;
  expires_at: string;
}

// Journal & Mood
export interface JournalEntry {
  id: string;
  user_id: string;
  title?: string;
  content?: string;
  mood?: number; // -5 to +5
  urge_level?: number; // 0 to 10
  created_at: string;
}

export interface Trigger {
  id: string;
  user_id?: string; // null for global triggers
  label: string;
}

// Finance
export interface FinanceTransaction {
  id: string;
  user_id: string;
  kind: 'spend' | 'save';
  amount_cents: number;
  currency: string;
  note?: string;
  occurred_at: string;
  created_at: string;
}

// Tasks & Recovery
export interface Task {
  id: string;
  user_id: string;
  title: string;
  kind: 'breathing' | 'reframe' | 'alt_hobby' | 'exercise' | 'meditation';
  payload?: Record<string, any>;
  created_at: string;
  archived: boolean;
}

export interface TaskCompletion {
  id: string;
  task_id: string;
  user_id: string;
  completed_at: string;
  rating?: number; // 1-5
  notes?: string;
}

// AI & Chat
export interface Message {
  id: string;
  user_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  meta?: Record<string, any>;
  created_at: string;
}

export interface RiskScore {
  id: string;
  user_id: string;
  kind: 'urge' | 'relapse' | 'crisis';
  score: number; // 0-1
  computed_at: string;
  features?: Record<string, any>;
}

// Safety & SOS
export interface TrustedContact {
  id: string;
  user_id: string;
  name: string;
  channel: 'sms' | 'email' | 'phone';
  value: string;
  is_primary: boolean;
  created_at: string;
}

export interface Helpline {
  id: string;
  country_code: string;
  name: string;
  phone?: string;
  sms?: string;
  web?: string;
  priority: number;
}

export interface SosEvent {
  id: string;
  user_id: string;
  source: 'manual' | 'detector';
  level: 'urge' | 'crisis';
  triggered_at: string;
  resolution?: string;
  meta?: Record<string, any>;
}

// Content & Education
export interface ContentItem {
  id: string;
  kind: 'article' | 'audio' | 'guide';
  title: string;
  body?: string;
  locale: string;
  tags: string[];
  created_at: string;
}

// Settings & Preferences
export interface UserSettings {
  user_id: string;
  timezone: string;
  consent_store_chat: boolean;
  daily_reminder_hour?: number;
  crisis_detection: boolean;
  created_at: string;
  updated_at: string;
}

// Self-exclusion
export interface SelfExclusion {
  id: string;
  user_id: string;
  starts_at: string;
  ends_at: string;
  reason?: string;
  created_at: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Request types
export interface CreateJournalEntryRequest {
  title?: string;
  content?: string;
  mood?: number;
  urge_level?: number;
  trigger_ids?: string[];
}

export interface CreateFinanceTransactionRequest {
  kind: 'spend' | 'save';
  amount_cents: number;
  currency: string;
  note?: string;
  occurred_at: string;
}

export interface CreateTaskRequest {
  title: string;
  kind: 'breathing' | 'reframe' | 'alt_hobby' | 'exercise' | 'meditation';
  payload?: Record<string, any>;
}

export interface SendMessageRequest {
  content: string;
  role?: 'user';
}

// Onboarding
export interface OnboardingData {
  frequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
  triggers: string[];
  goals: string[];
  emergency_contact: {
    name: string;
    channel: 'sms' | 'email' | 'phone';
    value: string;
  };
  country_code: string;
}
