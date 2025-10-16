// Environment configuration
export const config = {
  // Database
  database: {
    url: process.env.DATABASE_URL || '',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'quitbet_ai',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  },

  // Supabase
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },

  // API
  api: {
    port: parseInt(process.env.PORT || '3001'),
    host: process.env.HOST || 'localhost',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },

  // AI
  ai: {
    deepseekApiKey: process.env.DEEPSEEK_API_KEY || '',
    deepseekBaseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
  },

  // Security
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    encryptionKey: process.env.ENCRYPTION_KEY || 'your-encryption-key',
  },

  // Features
  features: {
    enableCrisisDetection: process.env.ENABLE_CRISIS_DETECTION === 'true',
    enableAiChat: process.env.ENABLE_AI_CHAT === 'true',
    enableAnalytics: process.env.ENABLE_ANALYTICS === 'true',
  },

  // External services
  external: {
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || '',
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || '',
    twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  },

  // Development
  development: {
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
  },
};

// Validation function
export function validateConfig() {
  const required = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn(`Missing required environment variables: ${missing.join(', ')}`);
    console.warn('Using placeholder values for development. Please configure your .env file.');
    
    // Set placeholder values for development
    if (!process.env.SUPABASE_URL) process.env.SUPABASE_URL = 'https://placeholder.supabase.co';
    if (!process.env.SUPABASE_ANON_KEY) process.env.SUPABASE_ANON_KEY = 'placeholder-anon-key';
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) process.env.SUPABASE_SERVICE_ROLE_KEY = 'placeholder-service-key';
  }
}

// Default helplines by country
export const helplines = {
  US: [
    {
      name: 'National Problem Gambling Helpline',
      phone: '1-800-522-4700',
      sms: '1-800-522-4700',
      web: 'https://www.ncpgambling.org/',
      priority: 1,
    },
  ],
  UK: [
    {
      name: 'GamCare',
      phone: '0808 8020 133',
      web: 'https://www.gamcare.org.uk/',
      priority: 1,
    },
  ],
  CA: [
    {
      name: 'Problem Gambling Institute of Ontario',
      phone: '1-888-230-3505',
      web: 'https://www.problemgambling.ca/',
      priority: 1,
    },
  ],
  AU: [
    {
      name: 'Gambling Help Online',
      phone: '1800 858 858',
      web: 'https://www.gamblinghelponline.org.au/',
      priority: 1,
    },
  ],
};

// Crisis detection keywords
export const crisisKeywords = [
  'kill myself',
  'end it all',
  'not worth living',
  'want to die',
  'suicide',
  'hurt myself',
  'no point',
  'give up',
  'hopeless',
  'worthless',
];

// Urge detection keywords
export const urgeKeywords = [
  'want to bet',
  'need to gamble',
  'place a bet',
  'play slots',
  'go to casino',
  'online gambling',
  'just one more',
  'can\'t stop',
  'gambling urge',
  'betting urge',
];
