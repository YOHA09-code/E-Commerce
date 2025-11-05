// Chapa Payment Gateway Integration for Ethiopian Market
// Documentation: https://developer.chapa.co/

export interface ChapaConfig {
  secretKey: string;
  publicKey: string;
  baseUrl: string;
}

export interface ChapaPaymentRequest {
  amount: number;
  currency: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  tx_ref: string;
  callback_url: string;
  return_url: string;
  customization?: {
    title?: string;
    description?: string;
    logo?: string;
  };
  meta?: Record<string, any>;
}

export interface ChapaPaymentResponse {
  status: string;
  message: string;
  data?: {
    checkout_url: string;
    tx_ref: string;
  };
}

export interface ChapaWebhookData {
  event: string;
  data: {
    id: string;
    tx_ref: string;
    flw_ref: string;
    device_fingerprint: string;
    amount: number;
    currency: string;
    charged_amount: number;
    app_fee: number;
    merchant_fee: number;
    processor_response: string;
    auth_model: string;
    card: {
      first_6digits: string;
      last_4digits: string;
      issuer: string;
      country: string;
      type: string;
      token: string;
      expiry: string;
    };
    created_at: string;
    status: string;
    payment_type: string;
    narration: string;
    processor_response_code: string;
    customer: {
      id: number;
      phone_number: string;
      name: string;
      email: string;
      created_at: string;
    };
    account_id: number;
  };
}

class ChapaPayment {
  private config: ChapaConfig;

  constructor() {
    this.config = {
      secretKey: process.env.CHAPA_SECRET_KEY!,
      publicKey: process.env.CHAPA_PUBLIC_KEY!,
      baseUrl:
        process.env.NODE_ENV === "production"
          ? "https://api.chapa.co/v1"
          : "https://api.chapa.co/v1", // Chapa uses same URL for test and production
    };
  }

  async initializePayment(
    paymentData: ChapaPaymentRequest
  ): Promise<ChapaPaymentResponse> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/transaction/initialize`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.config.secretKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to initialize payment");
      }

      return result;
    } catch (error) {
      console.error("Chapa payment initialization error:", error);
      throw new Error("Failed to initialize payment");
    }
  }

  async verifyPayment(txRef: string): Promise<ChapaPaymentResponse> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/transaction/verify/${txRef}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.config.secretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to verify payment");
      }

      return result;
    } catch (error) {
      console.error("Chapa payment verification error:", error);
      throw new Error("Failed to verify payment");
    }
  }

  validateWebhookSignature(payload: string, signature: string): boolean {
    // Chapa webhook signature validation
    // Implementation depends on Chapa's webhook signature method
    const expectedSignature = process.env.CHAPA_WEBHOOK_SECRET;
    return signature === expectedSignature;
  }

  parseWebhookData(payload: string): ChapaWebhookData {
    try {
      return JSON.parse(payload);
    } catch (error) {
      throw new Error("Invalid webhook payload");
    }
  }

  getPaymentUrl(checkoutUrl: string): string {
    return checkoutUrl;
  }

  formatAmount(amount: number): number {
    // Chapa expects amount in cents for ETB
    return Math.round(amount * 100);
  }

  generateTxRef(): string {
    return `chapa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const chapaPayment = new ChapaPayment();

// Helper functions
export function createChapaPaymentRequest(
  orderData: {
    amount: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    orderId: string;
  },
  callbackUrl: string,
  returnUrl: string
): ChapaPaymentRequest {
  return {
    amount: chapaPayment.formatAmount(orderData.amount),
    currency: "ETB",
    email: orderData.email,
    first_name: orderData.firstName,
    last_name: orderData.lastName,
    phone_number: orderData.phone,
    tx_ref: chapaPayment.generateTxRef(),
    callback_url: callbackUrl,
    return_url: returnUrl,
    customization: {
      title: "EthioShop Payment",
      description: "Complete your purchase on EthioShop",
    },
    meta: {
      order_id: orderData.orderId,
      source: "ethiopian-ecommerce",
    },
  };
}
