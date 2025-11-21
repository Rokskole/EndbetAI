import * as InAppPurchases from 'expo-in-app-purchases';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { apiClient } from './apiClient';

// Declare window for web platform
declare const window: any;

// Product IDs - must match App Store Connect / Stripe
// Note: Product IDs cannot be reused after deletion, so using .v1 suffix
export const PRODUCT_IDS = {
  PREMIUM_MONTHLY: Platform.OS === 'ios' 
    ? 'com.quitbetai.app.premium.monthly.v1' 
    : 'premium_monthly',
  PREMIUM_YEARLY: Platform.OS === 'ios'
    ? 'com.quitbetai.app.premium.yearly.v1'
    : 'premium_yearly',
  PREMIUM_LIFETIME: Platform.OS === 'ios'
    ? 'com.quitbetai.app.premium.lifetime.v1'
    : 'premium_lifetime',
} as const;

export type ProductId = typeof PRODUCT_IDS[keyof typeof PRODUCT_IDS];
export type SubscriptionTier = 'free' | 'premium' | null;

export interface Product {
  productId: string;
  title: string;
  description: string;
  price: string;
  currencyCode?: string;
  type: 'consumable' | 'non-consumable' | 'subscription';
}

export interface PurchaseResult {
  success: boolean;
  productId?: string;
  transactionId?: string;
  receipt?: string;
  error?: string;
}

/**
 * Unified Payment Service
 * Handles both Apple IAP (iOS) and Stripe (Android/Web)
 */
class PaymentService {
  private isIAPInitialized = false;
  private isPlatformSupported: boolean;

  constructor() {
    // IAP is only available on iOS and Android (not web)
    this.isPlatformSupported = Platform.OS === 'ios' || Platform.OS === 'android';
  }

  /**
   * Initialize payment system
   * For iOS: Initialize IAP
   * For Android/Web: Connect to Stripe
   */
  async initialize(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      return this.initializeIAP();
    } else if (Platform.OS === 'android') {
      // Android can use IAP or Stripe - we'll use Stripe for now
      return this.initializeStripe();
    } else {
      // Web - use Stripe
      return this.initializeStripe();
    }
  }

  /**
   * Initialize Apple In-App Purchases (iOS)
   */
  private async initializeIAP(): Promise<boolean> {
    try {
      if (this.isIAPInitialized) {
        return true;
      }

      // Connect to App Store
      await InAppPurchases.connectAsync();
      this.isIAPInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize IAP:', error);
      return false;
    }
  }

  /**
   * Initialize Stripe (Android/Web)
   * For now, this will integrate with your backend API
   */
  private async initializeStripe(): Promise<boolean> {
    // Stripe integration will be handled via your backend API
    // The backend creates payment intents and handles webhooks
    return true;
  }

  /**
   * Get available products for purchase
   */
  async getProducts(): Promise<Product[]> {
    if (Platform.OS === 'ios') {
      return this.getIAPProducts();
    } else {
      // For Android/Web, get products from your backend/Stripe
      return this.getStripeProducts();
    }
  }

  /**
   * Get IAP products (iOS)
   */
  private async getIAPProducts(): Promise<Product[]> {
    try {
      await this.initializeIAP();
      
      const productIds = Object.values(PRODUCT_IDS);
      const { results } = await InAppPurchases.getProductsAsync(productIds);

      return results.map((item) => ({
        productId: item.productId,
        title: item.title,
        description: item.description,
        price: item.price,
        currencyCode: item.currencyCode,
        type: item.type === InAppPurchases.IAPProductType.SUBSCRIPTION 
          ? 'subscription' 
          : 'non-consumable',
      }));
    } catch (error) {
      console.error('Failed to get IAP products:', error);
      return [];
    }
  }

  /**
   * Get Stripe products (Android/Web)
   * Fetch from your backend API which communicates with Stripe
   */
  private async getStripeProducts(): Promise<Product[]> {
    try {
      // Call your backend API to get Stripe product prices
      const response = await fetch(
        `${Constants.expoConfig?.extra?.apiUrl || 'https://endbet-ai-api-749k.vercel.app'}/api/payments/products`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Failed to get Stripe products:', error);
      // Return default products if API fails
      return [
        {
          productId: PRODUCT_IDS.PREMIUM_MONTHLY,
          title: 'Premium Monthly',
          description: 'Unlock all premium features for one month',
          price: '$4.99',
          type: 'subscription' as const,
        },
        {
          productId: PRODUCT_IDS.PREMIUM_YEARLY,
          title: 'Premium Yearly',
          description: 'Unlock all premium features for one year (Save 30%)',
          price: '$39.99',
          type: 'subscription' as const,
        },
        {
          productId: PRODUCT_IDS.PREMIUM_LIFETIME,
          title: 'Premium Lifetime',
          description: 'Unlock all premium features forever',
          price: '$99.99',
          type: 'non-consumable' as const,
        },
      ];
    }
  }

  /**
   * Purchase a product
   */
  async purchaseProduct(productId: ProductId): Promise<PurchaseResult> {
    if (Platform.OS === 'ios') {
      return this.purchaseIAP(productId);
    } else {
      return this.purchaseStripe(productId);
    }
  }

  /**
   * Purchase via Apple IAP (iOS)
   */
  private async purchaseIAP(productId: ProductId): Promise<PurchaseResult> {
    try {
      await this.initializeIAP();

      // Set up listener before purchasing
      let purchaseResolve: (value: PurchaseResult) => void;
      const purchasePromise = new Promise<PurchaseResult>((resolve) => {
        purchaseResolve = resolve;
      });

      const subscription = InAppPurchases.purchaseUpdatedListener(
        async ({ response, results }) => {
          if (response === InAppPurchases.IAPResponseCode.OK && results) {
            const purchase = results[0];
            
            // Verify purchase with your backend
            const verified = await this.verifyIAPPurchase(purchase);
            
            subscription.remove();
            
            if (verified) {
              purchaseResolve({
                success: true,
                productId: purchase.productId,
                transactionId: purchase.transactionId,
                receipt: purchase.transactionReceipt,
              });
            } else {
              purchaseResolve({
                success: false,
                error: 'Purchase verification failed',
              });
            }
          } else {
            subscription.remove();
            purchaseResolve({
              success: false,
              error: 'Purchase cancelled or failed',
            });
          }
        }
      );

      // Purchase the product
      await InAppPurchases.purchaseItemAsync(productId);

      // Wait for purchase result
      return purchasePromise;
    } catch (error: any) {
      console.error('IAP purchase error:', error);
      return {
        success: false,
        error: error.message || 'Purchase failed',
      };
    }
  }

  /**
   * Purchase via Stripe (Android/Web)
   */
  private async purchaseStripe(productId: ProductId): Promise<PurchaseResult> {
    try {
      // Create payment intent via your backend
      const response = await fetch(
        `${Constants.expoConfig?.extra?.apiUrl || 'https://endbet-ai-api-749k.vercel.app'}/api/payments/create-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret, intentId } = await response.json();

      // For web, open Stripe Checkout
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        // Redirect to Stripe Checkout or use Stripe Elements
        // This would require Stripe.js integration
        window.location.href = `${Constants.expoConfig?.extra?.apiUrl || 'https://endbet-ai-api-749k.vercel.app'}/api/payments/checkout?intent=${intentId}`;
        
        return {
          success: false,
          error: 'Web checkout redirect initiated',
        };
      }

      // For Android, return client secret for native Stripe SDK
      return {
        success: true,
        transactionId: intentId,
        // clientSecret would be used with Stripe Android SDK
      };
    } catch (error: any) {
      console.error('Stripe purchase error:', error);
      return {
        success: false,
        error: error.message || 'Purchase failed',
      };
    }
  }

  /**
   * Verify IAP purchase with backend
   */
  private async verifyIAPPurchase(purchase: InAppPurchases.InAppPurchase): Promise<boolean> {
    try {
      const response = await apiClient.request('/payments/verify-iap', {
        method: 'POST',
        body: JSON.stringify({
          productId: purchase.productId,
          transactionId: purchase.transactionId,
          receipt: purchase.transactionReceipt,
          platform: 'ios',
        }),
      });

      return response.success === true;
    } catch (error) {
      console.error('Failed to verify IAP purchase:', error);
      return false;
    }
  }

  /**
   * Restore previous purchases (iOS)
   */
  async restorePurchases(): Promise<PurchaseResult[]> {
    if (Platform.OS !== 'ios') {
      // For Android/Web, check subscription status via backend
      return this.restoreStripePurchases();
    }

    try {
      await this.initializeIAP();

      // Get purchase history
      const { results, responseCode } = await InAppPurchases.getPurchaseHistoryAsync();

      if (responseCode === InAppPurchases.IAPResponseCode.OK && results) {
        const purchases: PurchaseResult[] = results.map((purchase) => ({
          success: true,
          productId: purchase.productId,
          transactionId: purchase.transactionId,
          receipt: purchase.transactionReceipt,
        }));

        // Verify all purchases with backend
        const verifiedPurchases = await Promise.all(
          purchases.map(async (purchase) => {
            const verified = await this.verifyIAPPurchase({
              productId: purchase.productId!,
              transactionId: purchase.transactionId!,
              transactionReceipt: purchase.receipt!,
            } as InAppPurchases.InAppPurchase);
            return verified ? purchase : null;
          })
        );

        return verifiedPurchases.filter((p): p is PurchaseResult => p !== null);
      }

      return [];
    } catch (error: any) {
      console.error('Failed to restore purchases:', error);
      return [{ success: false, error: error.message || 'Restore failed' }];
    }
  }

  /**
   * Restore Stripe purchases (Android/Web)
   */
  private async restoreStripePurchases(): Promise<PurchaseResult[]> {
    try {
      // Check subscription status via backend
      const response = await apiClient.request('/payments/subscription-status', {
        method: 'GET',
      });

      if (response.success && response.data?.active) {
        return [{
          success: true,
          productId: response.data.productId,
        }];
      }

      return [];
    } catch (error) {
      console.error('Failed to restore Stripe purchases:', error);
      return [];
    }
  }

  /**
   * Check if user has active premium subscription
   */
  async checkPremiumStatus(): Promise<boolean> {
    try {
      const response = await apiClient.request('/payments/premium-status', {
        method: 'GET',
      });

      return response.success === true && response.data?.isPremium === true;
    } catch (error) {
      console.error('Failed to check premium status:', error);
      return false;
    }
  }

  /**
   * Disconnect payment service
   */
  async disconnect(): Promise<void> {
    if (Platform.OS === 'ios' && this.isIAPInitialized) {
      try {
        await InAppPurchases.disconnectAsync();
        this.isIAPInitialized = false;
      } catch (error) {
        console.error('Failed to disconnect IAP:', error);
      }
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService();

