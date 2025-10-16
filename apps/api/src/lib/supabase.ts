import { createClient } from '@supabase/supabase-js';

// Get environment variables directly
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

// Create Supabase client
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Create admin client for server-side operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Database helper functions
export class DatabaseService {
  // User operations
  static async getUserById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserByEmail(email: string) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async createUser(userData: {
    email: string;
    display_name?: string;
    country_code?: string;
  }) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Journal operations
  static async createJournalEntry(entryData: {
    user_id: string;
    title?: string;
    content?: string;
    mood?: number;
    urge_level?: number;
  }) {
    const { data, error } = await supabaseAdmin
      .from('journal_entries')
      .insert(entryData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getJournalEntries(userId: string, limit: number = 20, offset: number = 0) {
    const { data, error } = await supabaseAdmin
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
  }

  // Finance operations
  static async createFinanceTransaction(transactionData: {
    user_id: string;
    kind: 'spend' | 'save';
    amount_cents: number;
    currency: string;
    note?: string;
    occurred_at: string;
  }) {
    const { data, error } = await supabaseAdmin
      .from('finance_transactions')
      .insert(transactionData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getFinanceTransactions(userId: string, limit: number = 20, offset: number = 0) {
    const { data, error } = await supabaseAdmin
      .from('finance_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('occurred_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
  }

  // Task operations
  static async createTask(taskData: {
    user_id: string;
    title: string;
    kind: string;
    payload?: Record<string, any>;
  }) {
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .insert(taskData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getTasks(userId: string, archived: boolean = false) {
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('archived', archived)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Message operations
  static async createMessage(messageData: {
    user_id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    meta?: Record<string, any>;
  }) {
    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert(messageData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getMessages(userId: string, limit: number = 50) {
    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }

  // Risk scoring
  static async createRiskScore(riskData: {
    user_id: string;
    kind: 'urge' | 'relapse' | 'crisis';
    score: number;
    features?: Record<string, any>;
  }) {
    const { data, error } = await supabaseAdmin
      .from('risk_scores')
      .insert(riskData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getLatestRiskScore(userId: string, kind: 'urge' | 'relapse' | 'crisis') {
    const { data, error } = await supabaseAdmin
      .from('risk_scores')
      .select('*')
      .eq('user_id', userId)
      .eq('kind', kind)
      .order('computed_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
}
