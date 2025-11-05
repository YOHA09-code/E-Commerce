import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateProductSchema = z.object({
  name: z.string().min(1, "Product name is required").optional(),
  nameAm: z.string().optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  descriptionAm: z.string().optional(),
  price: z.number().positive("Price must be positive").optional(),
  comparePrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  stock: z.number().int().min(0, "Stock cannot be negative").optional(),
  minStock: z.number().int().min(0).optional(),
  weight: z.number().positive().optional(),
  dimensions: z.string().optional(),
  images: z
    .array(z.string().url())
    .min(1, "At least one image is required")
    .optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  isDigital: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  categoryId: z.string().min(1, "Category is required").optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        vendor: {
          select: {
            id: true,
            businessName: true,
            businessType: true,
            verified: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            nameAm: true,
            slug: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        variants: {
          where: {
            isActive: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Calculate average rating
    const ratings = product.reviews.map((review: any) => review.rating);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum: any, rating: any) => sum + rating, 0) /
          ratings.length
        : 0;

    const productWithRating = {
      ...product,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: ratings.length,
    };

    return NextResponse.json(productWithRating);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const validatedData = updateProductSchema.parse(body);
    const { id } = await params;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Update slug if name is being updated
    let updateData: any = { ...validatedData };
    if (validatedData.name && validatedData.name !== existingProduct.name) {
      const slug = validatedData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      updateData.slug = slug;
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        vendor: {
          select: {
            id: true,
            businessName: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            nameAm: true,
          },
        },
        variants: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Soft delete by setting isActive to false
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
