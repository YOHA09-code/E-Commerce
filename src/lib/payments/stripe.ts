import Stripe from "stripe";

// Initialize Stripe
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-09-30.clover",
    })
  : null;

export interface StripePaymentRequest {
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  orderId: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface StripePaymentResponse {
  id: string;
  client_secret: string;
  url?: string;
}

export interface StripeWebhookData {
  id: string;
  object: string;
  type: string;
  data: {
    object: Stripe.PaymentIntent;
  };
}

class StripePayment {
  async createPaymentIntent(
    paymentData: StripePaymentRequest
  ): Promise<StripePaymentResponse> {
    if (!stripe) {
      throw new Error("Stripe is not configured");
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(paymentData.amount * 100), // Convert to cents
        currency: paymentData.currency.toLowerCase(),
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          orderId: paymentData.orderId,
          customerEmail: paymentData.customerEmail,
          customerName: paymentData.customerName,
          ...paymentData.metadata,
        },
        description:
          paymentData.description || `Payment for order ${paymentData.orderId}`,
      });

      return {
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret!,
      };
    } catch (error) {
      console.error("Stripe payment intent creation error:", error);
      throw new Error("Failed to create payment intent");
    }
  }

  async createCheckoutSession(
    paymentData: StripePaymentRequest
  ): Promise<StripePaymentResponse> {
    if (!stripe) {
      throw new Error("Stripe is not configured");
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: paymentData.currency.toLowerCase(),
              product_data: {
                name: `Order ${paymentData.orderId}`,
                description: paymentData.description || "EthioShop Order",
              },
              unit_amount: Math.round(paymentData.amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
        customer_email: paymentData.customerEmail,
        metadata: {
          orderId: paymentData.orderId,
          customerName: paymentData.customerName,
          ...paymentData.metadata,
        },
      });

      return {
        id: session.id,
        url: session.url!,
        client_secret: session.client_secret!,
      };
    } catch (error) {
      console.error("Stripe checkout session creation error:", error);
      throw new Error("Failed to create checkout session");
    }
  }

  async retrievePaymentIntent(
    paymentIntentId: string
  ): Promise<Stripe.PaymentIntent> {
    if (!stripe) {
      throw new Error("Stripe is not configured");
    }

    try {
      return await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error("Stripe payment intent retrieval error:", error);
      throw new Error("Failed to retrieve payment intent");
    }
  }

  async retrieveCheckoutSession(
    sessionId: string
  ): Promise<Stripe.Checkout.Session> {
    if (!stripe) {
      throw new Error("Stripe is not configured");
    }

    try {
      return await stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
      console.error("Stripe checkout session retrieval error:", error);
      throw new Error("Failed to retrieve checkout session");
    }
  }

  validateWebhookSignature(payload: string, signature: string): boolean {
    if (!stripe) {
      throw new Error("Stripe is not configured");
    }

    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );
      return !!event;
    } catch (error) {
      console.error("Stripe webhook signature validation error:", error);
      return false;
    }
  }

  parseWebhookData(payload: string, signature: string): Stripe.Event {
    if (!stripe) {
      throw new Error("Stripe is not configured");
    }

    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
      return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error) {
      console.error("Stripe webhook parsing error:", error);
      throw new Error("Invalid webhook signature");
    }
  }

  formatAmount(amount: number, currency: string = "USD"): number {
    // Stripe expects amount in cents
    return Math.round(amount * 100);
  }

  getSupportedCurrencies(): string[] {
    return ["USD", "EUR", "GBP", "CAD", "AUD"]; // Add more as needed
  }

  isCurrencySupported(currency: string): boolean {
    return this.getSupportedCurrencies().includes(currency.toUpperCase());
  }
}

export const stripePayment = new StripePayment();

// Helper functions
export function createStripePaymentRequest(orderData: {
  amount: number;
  currency: string;
  email: string;
  name: string;
  orderId: string;
  description?: string;
}): StripePaymentRequest {
  return {
    amount: orderData.amount,
    currency: orderData.currency,
    customerEmail: orderData.email,
    customerName: orderData.name,
    orderId: orderData.orderId,
    description: orderData.description,
    metadata: {
      source: "ethiopian-ecommerce",
      platform: "web",
    },
  };
}

export function getStripePublicKey(): string {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!;
}
