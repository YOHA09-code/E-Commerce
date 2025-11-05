import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
      variantId: z.string().optional(),
    })
  ),
  shippingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    address1: z.string().min(1),
    address2: z.string().optional(),
    city: z.string().min(1),
    region: z.string().min(1),
    postalCode: z.string().optional(),
  }),
  billingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    address1: z.string().min(1),
    address2: z.string().optional(),
    city: z.string().min(1),
    region: z.string().min(1),
    postalCode: z.string().optional(),
  }),
  currency: z.enum(["ETB", "USD"]),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    // Verify all products exist and are available
    const productIds = validatedData.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
      include: {
        vendor: true,
      },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { message: "One or more products not found or unavailable" },
        { status: 400 }
      );
    }

    // Check stock availability
    for (const item of validatedData.items) {
      const product = products.find((p: any) => p.id === item.productId);
      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { message: `Insufficient stock for ${product?.name}` },
          { status: 400 }
        );
      }
    }

    // Calculate totals
    const subtotal = validatedData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.15; // 15% tax
    const total = subtotal + tax;

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx: any) => {
      // Create shipping address
      const shippingAddress = await tx.address.create({
        data: {
          userId: session.user.id,
          firstName: validatedData.shippingAddress.firstName,
          lastName: validatedData.shippingAddress.lastName,
          email: validatedData.shippingAddress.email,
          phone: validatedData.shippingAddress.phone,
          address1: validatedData.shippingAddress.address1,
          address2: validatedData.shippingAddress.address2,
          city: validatedData.shippingAddress.city,
          region: validatedData.shippingAddress.region,
          postalCode: validatedData.shippingAddress.postalCode,
          country: "Ethiopia",
        },
      });

      // Create billing address
      const billingAddress = await tx.address.create({
        data: {
          userId: session.user.id,
          firstName: validatedData.billingAddress.firstName,
          lastName: validatedData.billingAddress.lastName,
          email: validatedData.billingAddress.email,
          phone: validatedData.billingAddress.phone,
          address1: validatedData.billingAddress.address1,
          address2: validatedData.billingAddress.address2,
          city: validatedData.billingAddress.city,
          region: validatedData.billingAddress.region,
          postalCode: validatedData.billingAddress.postalCode,
          country: "Ethiopia",
        },
      });

      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          total: total,
          status: "PENDING",
          paymentMethod: "CHAPA", // Default, will be updated based on payment
          paymentStatus: "pending",
          shippingAddressId: shippingAddress.id,
          billingAddressId: billingAddress.id,
          notes: validatedData.notes,
        },
      });

      // Create order items
      const orderItems = await Promise.all(
        validatedData.items.map((item) => {
          const product = products.find((p: any) => p.id === item.productId);
          return tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            },
          });
        })
      );

      // Update product stock
      await Promise.all(
        validatedData.items.map((item) => {
          return tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        })
      );

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: "CREATE",
          entity: "Order",
          entityId: newOrder.id,
          newValues: JSON.stringify({
            total: total,
            status: "PENDING",
            items: validatedData.items.length,
            currency: validatedData.currency,
          }),
          ipAddress:
            request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            "unknown",
          userAgent: request.headers.get("user-agent") || "unknown",
        },
      });

      return {
        ...newOrder,
        orderItems,
        shippingAddress,
        billingAddress,
      };
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }

    console.error("Order creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    const where: any = {
      userId: session.user.id,
    };

    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  nameAm: true,
                  images: true,
                },
              },
            },
          },
          payments: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
