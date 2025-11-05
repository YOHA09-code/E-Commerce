import { NextRequest, NextResponse } from "next/server";
import { chapaPayment } from "@/lib/payments/chapa";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("chapa-signature") || "";

    // Validate webhook signature
    if (!chapaPayment.validateWebhookSignature(body, signature)) {
      console.error("Invalid Chapa webhook signature");
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 }
      );
    }

    // Parse webhook data
    const webhookData = chapaPayment.parseWebhookData(body);

    console.log("Chapa webhook received:", webhookData);

    // Handle different webhook events
    switch (webhookData.event) {
      case "charge.completed":
        await handlePaymentCompleted(webhookData);
        break;
      case "charge.failed":
        await handlePaymentFailed(webhookData);
        break;
      default:
        console.log(`Unhandled Chapa webhook event: ${webhookData.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Chapa webhook error:", error);
    return NextResponse.json(
      { message: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentCompleted(webhookData: any) {
  try {
    const { tx_ref, status, amount, currency } = webhookData.data;

    // Find payment record
    const payment = await prisma.payment.findFirst({
      where: {
        providerId: tx_ref,
        provider: "CHAPA",
      },
      include: {
        order: true,
      },
    });

    if (!payment) {
      console.error(`Payment not found for tx_ref: ${tx_ref}`);
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
            webhook_data: webhookData.data,
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
            amount: amount,
            currency: currency,
            provider: "CHAPA",
          }),
          ipAddress: "webhook",
          userAgent: "chapa-webhook",
        },
      });
    });

    console.log(`Payment completed for order: ${payment.orderId}`);
  } catch (error) {
    console.error("Error handling payment completion:", error);
    throw error;
  }
}

async function handlePaymentFailed(webhookData: any) {
  try {
    const { tx_ref, status } = webhookData.data;

    // Find payment record
    const payment = await prisma.payment.findFirst({
      where: {
        providerId: tx_ref,
        provider: "CHAPA",
      },
    });

    if (!payment) {
      console.error(`Payment not found for tx_ref: ${tx_ref}`);
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
            webhook_data: webhookData.data,
            failure_reason: "Payment failed via webhook",
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
            provider: "CHAPA",
            failure_reason: "Payment failed via webhook",
          }),
          ipAddress: "webhook",
          userAgent: "chapa-webhook",
        },
      });
    });

    console.log(`Payment failed for order: ${payment.orderId}`);
  } catch (error) {
    console.error("Error handling payment failure:", error);
    throw error;
  }
}
