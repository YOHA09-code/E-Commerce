import { NextRequest, NextResponse } from "next/server";
import { chapaPayment, createChapaPaymentRequest } from "@/lib/payments/chapa";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const chapaPaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  amount: z.number().positive("Amount must be positive"),
  email: z.string().email("Valid email is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = chapaPaymentSchema.parse(body);

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

    // Create Chapa payment request
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/chapa/webhook`;
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order_id=${order.id}`;

    const chapaRequest = createChapaPaymentRequest(
      {
        amount: validatedData.amount,
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone,
        orderId: order.id,
      },
      callbackUrl,
      returnUrl
    );

    // Initialize payment with Chapa
    const chapaResponse = await chapaPayment.initializePayment(chapaRequest);

    if (chapaResponse.status !== "success") {
      return NextResponse.json(
        { message: chapaResponse.message || "Failed to initialize payment" },
        { status: 400 }
      );
    }

    // Create payment record in database
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: validatedData.amount,
        currency: "ETB",
        provider: "CHAPA",
        providerId: chapaResponse.data?.tx_ref || "",
        status: "PENDING",
        method: "BANK_TRANSFER",
        metadata: JSON.stringify({
          chapa_tx_ref: chapaResponse.data?.tx_ref,
          checkout_url: chapaResponse.data?.checkout_url,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      checkoutUrl: chapaResponse.data?.checkout_url,
      txRef: chapaResponse.data?.tx_ref,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }

    console.error("Chapa payment error:", error);
    return NextResponse.json(
      { message: "Failed to process payment" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const txRef = searchParams.get("tx_ref");

    if (!txRef) {
      return NextResponse.json(
        { message: "Transaction reference is required" },
        { status: 400 }
      );
    }

    // Verify payment with Chapa
    const verificationResponse = await chapaPayment.verifyPayment(txRef);

    if (verificationResponse.status !== "success") {
      return NextResponse.json(
        { message: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Update payment status in database
    const payment = await prisma.payment.findFirst({
      where: {
        providerId: txRef,
        provider: "CHAPA",
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
    console.error("Chapa payment verification error:", error);
    return NextResponse.json(
      { message: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
