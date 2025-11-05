import { NextRequest, NextResponse } from "next/server";
import { stripePayment } from "@/lib/payments/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature") || "";

    // Parse and validate webhook
    const event = stripePayment.parseWebhookData(body, signature);

    console.log("Stripe webhook received:", event.type);

    // Handle different webhook events
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event);
        break;
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event);
        break;
      default:
        console.log(`Unhandled Stripe webhook event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { message: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(event: any) {
  try {
    const session = event.data.object;
    const sessionId = session.id;

    // Find payment record
    const payment = await prisma.payment.findFirst({
      where: {
        providerId: sessionId,
        provider: "STRIPE",
      },
      include: {
        order: true,
      },
    });

    if (!payment) {
      console.error(`Payment not found for session: ${sessionId}`);
      return;
    }

    // Update payment status
    await prisma.$transaction(async (tx: any) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "COMPLETED",
          processedAt: new Date(),
          metadata: JSON.stringify({
            ...JSON.parse(payment.metadata || "{}"),
            stripe_session: session,
          }),
        },
      });

      // Update order status
      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          status: "CONFIRMED",
        },
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          action: "PAYMENT_COMPLETED",
          entity: "Payment",
          entityId: payment.id,
          newValues: JSON.stringify({
            status: "COMPLETED",
            amount: session.amount_total / 100,
            currency: session.currency,
            provider: "STRIPE",
          }),
          ipAddress: "webhook",
          userAgent: "stripe-webhook",
        },
      });
    });

    console.log(`Payment completed for order: ${payment.orderId}`);
  } catch (error) {
    console.error("Error handling checkout session completion:", error);
    throw error;
  }
}

async function handlePaymentIntentSucceeded(event: any) {
  try {
    const paymentIntent = event.data.object;
    const paymentIntentId = paymentIntent.id;

    // Find payment record
    const payment = await prisma.payment.findFirst({
      where: {
        providerId: paymentIntentId,
        provider: "STRIPE",
      },
    });

    if (!payment) {
      console.error(`Payment not found for payment intent: ${paymentIntentId}`);
      return;
    }

    // Update payment status
    await prisma.$transaction(async (tx: any) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "COMPLETED",
          processedAt: new Date(),
          metadata: JSON.stringify({
            ...JSON.parse(payment.metadata || "{}"),
            stripe_payment_intent: paymentIntent,
          }),
        },
      });

      // Update order status
      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          status: "CONFIRMED",
        },
      });
    });

    console.log(`Payment intent succeeded for order: ${payment.orderId}`);
  } catch (error) {
    console.error("Error handling payment intent success:", error);
    throw error;
  }
}

async function handlePaymentIntentFailed(event: any) {
  try {
    const paymentIntent = event.data.object;
    const paymentIntentId = paymentIntent.id;

    // Find payment record
    const payment = await prisma.payment.findFirst({
      where: {
        providerId: paymentIntentId,
        provider: "STRIPE",
      },
    });

    if (!payment) {
      console.error(`Payment not found for payment intent: ${paymentIntentId}`);
      return;
    }

    // Update payment status
    await prisma.$transaction(async (tx: any) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "FAILED",
          processedAt: new Date(),
          metadata: JSON.stringify({
            ...JSON.parse(payment.metadata || "{}"),
            stripe_payment_intent: paymentIntent,
            failure_reason:
              paymentIntent.last_payment_error?.message || "Payment failed",
          }),
        },
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          action: "PAYMENT_FAILED",
          entity: "Payment",
          entityId: payment.id,
          newValues: JSON.stringify({
            status: "FAILED",
            provider: "STRIPE",
            failure_reason:
              paymentIntent.last_payment_error?.message || "Payment failed",
          }),
          ipAddress: "webhook",
          userAgent: "stripe-webhook",
        },
      });
    });

    console.log(`Payment intent failed for order: ${payment.orderId}`);
  } catch (error) {
    console.error("Error handling payment intent failure:", error);
    throw error;
  }
}
