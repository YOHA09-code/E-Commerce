import { NextRequest, NextResponse } from "next/server";
import {
  stripePayment,
  createStripePaymentRequest,
} from "@/lib/payments/stripe";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const stripePaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().min(3, "Currency is required"),
  email: z.string().email("Valid email is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = stripePaymentSchema.parse(body);

    // Verify order exists and is valid
    const order = await prisma.order.findUnique({
      where: { id: validatedData.orderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (order.status !== "PENDING") {
      return NextResponse.json(
        { message: "Order is not in pending status" },
        { status: 400 }
      );
    }

    // Check if currency is supported
    if (!stripePayment.isCurrencySupported(validatedData.currency)) {
      return NextResponse.json(
        { message: "Currency not supported by Stripe" },
        { status: 400 }
      );
    }

    // Create Stripe payment request
    const stripeRequest = createStripePaymentRequest({
      amount: validatedData.amount,
      currency: validatedData.currency,
      email: validatedData.email,
      name: validatedData.name,
      orderId: order.id,
      description: validatedData.description,
    });

    // Create checkout session
    const stripeResponse = await stripePayment.createCheckoutSession(
      stripeRequest
    );

    // Create payment record in database
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: validatedData.amount,
        currency: validatedData.currency,
        provider: "STRIPE",
        providerId: stripeResponse.id,
        status: "PENDING",
        method: "CARD",
        metadata: JSON.stringify({
          stripe_session_id: stripeResponse.id,
          checkout_url: stripeResponse.url,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      checkoutUrl: stripeResponse.url,
      sessionId: stripeResponse.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }

    console.error("Stripe payment error:", error);
    return NextResponse.json(
      { message: "Failed to process payment" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { message: "Session ID is required" },
        { status: 400 }
      );
    }

    // Retrieve checkout session from Stripe
    const session = await stripePayment.retrieveCheckoutSession(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { message: "Payment not completed" },
        { status: 400 }
      );
    }

    // Find payment record
    const payment = await prisma.payment.findFirst({
      where: {
        providerId: sessionId,
        provider: "STRIPE",
      },
    });

    if (!payment) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 }
      );
    }

    // Update payment and order status
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

      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          status: "CONFIRMED",
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Stripe payment verification error:", error);
    return NextResponse.json(
      { message: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
