import { Response } from 'express';
import Stripe from 'stripe';
import axios from 'axios';
import { config } from '@packages/config';
import { DatabaseService, supabaseAdmin } from '../../lib/supabase';
import { AuthenticatedRequest } from '../../middleware/auth';
import { createError } from '../../middleware/errorHandler';

// Initialize Stripe
const stripe = config.payments.stripeSecretKey
  ? new Stripe(config.payments.stripeSecretKey, {
      apiVersion: '2025-10-29.clover',
    })
  : null;

interface Product {
  productId: string;
  title: string;
  description: string;
  price: string;
  currencyCode?: string;
  type: 'consumable' | 'non-consumable' | 'subscription';
}

// Product definitions (fallback if Stripe is not configured)
const FALLBACK_PRODUCTS: Product[] = [
  {
    productId: 'premium_monthly',
    title: 'Premium Monthly',
    description: 'Unlock all premium features for one month',
    price: '$4.99',
    currencyCode: 'USD',
    type: 'subscription',
  },
  {
    productId: 'premium_yearly',
    title: 'Premium Yearly',
    description: 'Unlock all premium features for one year (Save 30%)',
    price: '$39.99',
    currencyCode: 'USD',
    type: 'subscription',
  },
  {
    productId: 'premium_lifetime',
    title: 'Premium Lifetime',
    description: 'Unlock all premium features forever',
    price: '$99.99',
    currencyCode: 'USD',
    type: 'non-consumable',
  },
];

export const paymentsController = {
  /**
   * Get available products (for Stripe - Android/Web)
   * GET /api/payments/products
   */
  getProducts: async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!stripe) {
        // Return fallback products if Stripe is not configured
        return res.json({
          success: true,
          products: FALLBACK_PRODUCTS,
        });
      }

      // Get products from Stripe
      const products = await stripe.products.list({ active: true });
      const prices = await stripe.prices.list({ active: true });

      const productsList: Product[] = products.data
        .filter((product) => product.name?.includes('Premium'))
        .map((product) => {
          const productPrice = prices.data.find(
            (price) => price.product === product.id
          );

          return {
            productId: product.id,
            title: product.name || 'Premium',
            description: product.description || 'Premium features',
            price: productPrice
              ? `$${(productPrice.unit_amount || 0) / 100}`
              : '$0.00',
            currencyCode: productPrice?.currency?.toUpperCase() || 'USD',
            type:
              productPrice?.type === 'recurring' ? 'subscription' : 'non-consumable',
          };
        });

      res.json({
        success: true,
        products: productsList.length > 0 ? productsList : FALLBACK_PRODUCTS,
      });
    } catch (error: any) {
      throw createError('Failed to fetch products', 500);
    }
  },

  /**
   * Create Stripe payment intent (for Android/Web)
   * POST /api/payments/create-intent
   */
  createIntent: async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!stripe) {
        throw createError('Stripe is not configured', 500);
      }

      if (!req.user) {
        throw createError('User not authenticated', 401);
      }

      const { productId } = req.body;

      if (!productId) {
        throw createError('Product ID is required', 400);
      }

      // Get product price from Stripe
      const prices = await stripe.prices.list({
        active: true,
        product: productId,
      });

      if (prices.data.length === 0) {
        throw createError('Product not found', 404);
      }

      const price = prices.data[0];

      // Create payment intent or checkout session
      if (price.type === 'recurring') {
        // For subscriptions, create a checkout session
        const session = await stripe.checkout.sessions.create({
          mode: 'subscription',
          payment_method_types: ['card'],
          line_items: [
            {
              price: price.id,
              quantity: 1,
            },
          ],
          customer_email: req.user.email,
          metadata: {
            userId: req.user.id,
            productId: productId,
          },
          success_url: `${req.headers.origin || 'https://your-app.com'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${req.headers.origin || 'https://your-app.com'}/payment/cancel`,
        });

        return res.json({
          success: true,
          clientSecret: session.id,
          intentId: session.id,
          checkoutUrl: session.url,
        });
      } else {
        // For one-time payments, create a payment intent
        const intent = await stripe.paymentIntents.create({
          amount: price.unit_amount || 0,
          currency: price.currency || 'usd',
          metadata: {
            userId: req.user.id,
            productId: productId,
          },
        });

        return res.json({
          success: true,
          clientSecret: intent.client_secret,
          intentId: intent.id,
        });
      }
    } catch (error: any) {
      throw createError('Failed to create payment intent', 500);
    }
  },

  /**
   * Verify Apple In-App Purchase (iOS)
   * POST /api/payments/verify-iap
   */
  verifyIAP: async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        throw createError('User not authenticated', 401);
      }

      const { productId, transactionId, receipt, platform } = req.body;

      if (!productId || !transactionId || !receipt) {
        throw createError('Missing required fields', 400);
      }

      // Verify receipt with Apple
      const isVerified = await verifyAppleReceipt(receipt, productId);

      if (!isVerified) {
        throw createError('Invalid receipt', 400);
      }

      // Store purchase in database
      await storePurchase({
        userId: req.user.id,
        productId,
        transactionId,
        platform: platform || 'ios',
        receipt,
      });

      // Update user premium status
      await updatePremiumStatus(req.user.id, productId);

      res.json({
        success: true,
        verified: true,
      });
    } catch (error: any) {
      throw createError('Failed to verify IAP purchase', 500);
    }
  },

  /**
   * Check premium status
   * GET /api/payments/premium-status
   */
  getPremiumStatus: async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        throw createError('User not authenticated', 401);
      }

      const premiumStatus = await checkUserPremiumStatus(req.user.id);

      res.json({
        success: true,
        data: {
          isPremium: premiumStatus.isPremium,
          productId: premiumStatus.productId,
          expiresAt: premiumStatus.expiresAt,
        },
      });
    } catch (error: any) {
      throw createError('Failed to check premium status', 500);
    }
  },

  /**
   * Get subscription status (for Stripe - Android/Web)
   * GET /api/payments/subscription-status
   */
  getSubscriptionStatus: async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        throw createError('User not authenticated', 401);
      }

      // Check database for active subscription
      const premiumStatus = await checkUserPremiumStatus(req.user.id);

      res.json({
        success: true,
        data: {
          active: premiumStatus.isPremium,
          productId: premiumStatus.productId,
        },
      });
    } catch (error: any) {
      throw createError('Failed to check subscription status', 500);
    }
  },

  /**
   * Stripe webhook handler
   * POST /api/payments/webhook
   */
  handleWebhook: async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!stripe || !config.payments.stripeWebhookSecret) {
        throw createError('Webhook not configured', 500);
      }

      const sig = req.headers['stripe-signature'] as string;

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          config.payments.stripeWebhookSecret
        );
      } catch (err: any) {
        throw createError(`Webhook signature verification failed: ${err.message}`, 400);
      }

      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object as Stripe.Checkout.Session;
          if (session.metadata?.userId && session.metadata?.productId) {
            await updatePremiumStatus(
              session.metadata.userId,
              session.metadata.productId
            );
          }
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          const subscription = event.data.object as Stripe.Subscription;
          const customer = await stripe.customers.retrieve(subscription.customer as string);
          if (customer && 'email' in customer && customer.email) {
            const user = await DatabaseService.getUserByEmail(customer.email);
            if (user && subscription.items.data[0]) {
              await updatePremiumStatus(
                user.id,
                subscription.items.data[0].price.product as string
              );
            }
          }
          break;

        case 'customer.subscription.deleted':
          // Handle subscription cancellation
          const deletedSubscription = event.data.object as Stripe.Subscription;
          const deletedCustomer = await stripe.customers.retrieve(deletedSubscription.customer as string);
          if (deletedCustomer && 'email' in deletedCustomer && deletedCustomer.email) {
            const user = await DatabaseService.getUserByEmail(deletedCustomer.email);
            if (user) {
              await removePremiumStatus(user.id);
            }
          }
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error: any) {
      throw createError('Webhook handling failed', 500);
    }
  },
};

/**
 * Verify Apple receipt with Apple's servers
 */
async function verifyAppleReceipt(
  receipt: string,
  productId: string
): Promise<boolean> {
  try {
    // Use Apple's production server first
    const verifyUrl = 'https://buy.itunes.apple.com/verifyReceipt';

    // In production, use production URL
    // In sandbox (test), use sandbox URL: https://sandbox.itunes.apple.com/verifyReceipt

    const response = await axios.post(verifyUrl, {
      'receipt-data': receipt,
      password: config.payments.appleSharedSecret, // Shared secret from App Store Connect
      'exclude-old-transactions': true,
    });

    const result = response.data;

    // Check if receipt is valid
    if (result.status === 0) {
      // Verify the product ID matches
      if (result.receipt && result.receipt.in_app) {
        const purchase = result.receipt.in_app.find(
          (purchase: any) => purchase.product_id === productId
        );
        return !!purchase;
      }
    } else if (result.status === 21007) {
      // Receipt is from sandbox, retry with sandbox URL
      const sandboxResponse = await axios.post(
        'https://sandbox.itunes.apple.com/verifyReceipt',
        {
          'receipt-data': receipt,
          password: config.payments.appleSharedSecret,
          'exclude-old-transactions': true,
        }
      );

      const sandboxResult = sandboxResponse.data;
      if (sandboxResult.status === 0 && sandboxResult.receipt?.in_app) {
        const purchase = sandboxResult.receipt.in_app.find(
          (purchase: any) => purchase.product_id === productId
        );
        return !!purchase;
      }
    }

    return false;
  } catch (error) {
    console.error('Apple receipt verification error:', error);
    return false;
  }
}

/**
 * Store purchase in database
 */
async function storePurchase(purchaseData: {
  userId: string;
  productId: string;
  transactionId: string;
  platform: string;
  receipt: string;
}) {
  try {
    // Store purchase in a purchases/subscriptions table
    // This would need a database table for purchases
    const { error } = await supabaseAdmin.from('purchases').insert({
      user_id: purchaseData.userId,
      product_id: purchaseData.productId,
      transaction_id: purchaseData.transactionId,
      platform: purchaseData.platform,
      receipt_data: purchaseData.receipt,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Failed to store purchase:', error);
    }
  } catch (error) {
    console.error('Error storing purchase:', error);
  }
}

/**
 * Update user premium status
 */
async function updatePremiumStatus(userId: string, productId: string) {
  try {
    // Determine expiration based on product type
    let expiresAt: string | null = null;

    if (productId.includes('monthly')) {
      expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    } else if (productId.includes('yearly')) {
      expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    } else if (productId.includes('lifetime')) {
      expiresAt = null; // Lifetime, no expiration
    }

    // Update user's premium status in database
    // You may need to add a premium_status or subscription table
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        is_premium: true,
        premium_product_id: productId,
        premium_expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Failed to update premium status:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating premium status:', error);
    throw error;
  }
}

/**
 * Remove premium status
 */
async function removePremiumStatus(userId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        is_premium: false,
        premium_product_id: null,
        premium_expires_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Failed to remove premium status:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error removing premium status:', error);
    throw error;
  }
}

/**
 * Check user's premium status
 */
async function checkUserPremiumStatus(userId: string): Promise<{
  isPremium: boolean;
  productId: string | null;
  expiresAt: string | null;
}> {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('is_premium, premium_product_id, premium_expires_at')
      .eq('id', userId)
      .single();

    if (error) {
      return { isPremium: false, productId: null, expiresAt: null };
    }

    // Check if premium is expired
    const isExpired =
      data.premium_expires_at &&
      new Date(data.premium_expires_at) < new Date();

    const isPremium = data.is_premium === true && !isExpired;

    // If expired, remove premium status
    if (isExpired && data.is_premium) {
      await removePremiumStatus(userId);
    }

    return {
      isPremium,
      productId: data.premium_product_id || null,
      expiresAt: data.premium_expires_at || null,
    };
  } catch (error) {
    console.error('Error checking premium status:', error);
    return { isPremium: false, productId: null, expiresAt: null };
  }
}

