export declare const config: {
    database: {
        url: string;
        host: string;
        port: number;
        name: string;
        user: string;
        password: string;
    };
    supabase: {
        url: string;
        anonKey: string;
        serviceRoleKey: string;
    };
    api: {
        port: number;
        host: string;
        corsOrigin: string;
    };
    ai: {
        deepseekApiKey: string;
        deepseekBaseUrl: string;
    };
    security: {
        jwtSecret: string;
        jwtExpiresIn: string;
        encryptionKey: string;
    };
    features: {
        enableCrisisDetection: boolean;
        enableAiChat: boolean;
        enableAnalytics: boolean;
    };
    external: {
        twilioAccountSid: string;
        twilioAuthToken: string;
        twilioPhoneNumber: string;
    };
    development: {
        isDev: boolean;
        isProd: boolean;
        isTest: boolean;
    };
};
export declare function validateConfig(): void;
export declare const helplines: {
    US: {
        name: string;
        phone: string;
        sms: string;
        web: string;
        priority: number;
    }[];
    UK: {
        name: string;
        phone: string;
        web: string;
        priority: number;
    }[];
    CA: {
        name: string;
        phone: string;
        web: string;
        priority: number;
    }[];
    AU: {
        name: string;
        phone: string;
        web: string;
        priority: number;
    }[];
};
export declare const crisisKeywords: string[];
export declare const urgeKeywords: string[];
//# sourceMappingURL=index.d.ts.map