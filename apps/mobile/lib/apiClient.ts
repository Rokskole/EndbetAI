import { config } from '@packages/config';
import { ApiResponse } from '@packages/types';

const API_BASE_URL = `${config.api.host}:${config.api.port}/api`;

export class ApiClient {
  private sessionId: string | null = null;

  setSessionId(sessionId: string | null) {
    this.sessionId = sessionId;
  }

  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.sessionId) {
      headers['X-Session-ID'] = this.sessionId;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async sendMagicLink(email: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyMagicLink(tokenHash: string, type: string, email: string) {
    return this.request('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token_hash: tokenHash, type, email }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ sessionId: this.sessionId }),
    });
  }

  async getCurrentUser() {
    return this.request<import('@packages/types').User>('/auth/me');
  }

  async refreshSession() {
    return this.request('/auth/refresh', {
      method: 'POST',
    });
  }

  // Journal endpoints
  async getJournalEntries(page = 1, limit = 20) {
    return this.request(`/journal?page=${page}&limit=${limit}`);
  }

  async createJournalEntry(entry: any) {
    return this.request('/journal', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  }

  // Finance endpoints
  async getFinanceTransactions(page = 1, limit = 20) {
    return this.request(`/finance/transactions?page=${page}&limit=${limit}`);
  }

  async createFinanceTransaction(transaction: any) {
    return this.request('/finance/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async getFinanceSummary() {
    return this.request('/finance/summary');
  }

  // Task endpoints
  async getTasks() {
    return this.request('/tasks');
  }

  async createTask(task: any) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async completeTask(taskId: string, rating?: number, notes?: string) {
    return this.request(`/tasks/${taskId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ rating, notes }),
    });
  }

  // SOS endpoints
  async triggerSOS(level: 'urge' | 'crisis', source: 'manual' | 'detector' = 'manual') {
    return this.request('/sos/trigger', {
      method: 'POST',
      body: JSON.stringify({ level, source }),
    });
  }

  async getHelplines() {
    return this.request('/sos/helplines');
  }

  async getTrustedContacts() {
    return this.request('/sos/contacts');
  }

  async createTrustedContact(contact: any) {
    return this.request('/sos/contacts', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
  }

  // Chat endpoints
  async getMessages(limit = 50) {
    return this.request(`/chat/messages?limit=${limit}`);
  }

  async sendMessage(content: string) {
    return this.request('/chat/messages', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async analyzeMessage(content: string) {
    return this.request('/chat/analyze', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Content endpoints
  async getArticles() {
    return this.request('/content/articles');
  }

  async getGuides() {
    return this.request('/content/guides');
  }

  async searchContent(query: string) {
    return this.request(`/content/search?q=${encodeURIComponent(query)}`);
  }
}

export const apiClient = new ApiClient();
