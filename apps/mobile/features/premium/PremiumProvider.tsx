import React, { createContext, useContext, useEffect, useState } from 'react';
import { paymentService, SubscriptionTier } from '@/lib/payments';

interface PremiumContextType {
  isPremium: boolean;
  isLoading: boolean;
  subscriptionTier: SubscriptionTier;
  checkPremiumStatus: () => Promise<void>;
  refreshPremiumStatus: () => Promise<void>;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free');

  const checkPremiumStatus = async () => {
    try {
      const hasPremium = await paymentService.checkPremiumStatus();
      setIsPremium(hasPremium);
      setSubscriptionTier(hasPremium ? 'premium' : 'free');
    } catch (error) {
      console.error('Failed to check premium status:', error);
      setIsPremium(false);
      setSubscriptionTier('free');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPremiumStatus = async () => {
    setIsLoading(true);
    await checkPremiumStatus();
  };

  useEffect(() => {
    // Initialize payment service
    paymentService.initialize().then(() => {
      // Check premium status
      checkPremiumStatus();
    });

    // Check premium status periodically (every 5 minutes)
    const interval = setInterval(() => {
      checkPremiumStatus();
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      paymentService.disconnect();
    };
  }, []);

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        isLoading,
        subscriptionTier,
        checkPremiumStatus,
        refreshPremiumStatus,
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
}

