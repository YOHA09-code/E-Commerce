import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  nameAm: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  descriptionAm: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  comparePrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  minStock: z.number().int().min(0).optional(),
  weight: z.number().positive().optional(),
  dimensions: z.string().optional(),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  isDigital: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  vendorId: z.string().min(1, "Vendor is required"),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const isActive = searchParams.get("isActive") !== "false";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { nameAm: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
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
          reviews: {
            select: {
              rating: true,
            },
          },
          variants: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate average ratings
    const productsWithRatings = products.map((product: any) => {
      const ratings = product.reviews.map((review: any) => review.rating);
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum: any, rating: any) => sum + rating, 0) /
            ratings.length
          : 0;

      return {
        ...product,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: ratings.length,
      };
    });

    return NextResponse.json({
      products: productsWithRatings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = productSchema.parse(body);

    // Generate SKU
    const sku = `PRD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;

    // Generate slug
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const product = await prisma.product.create({
      data: {
        ...validatedData,
        sku,
        slug,
        images: validatedData.images,
        tags: validatedData.tags || [],
      },
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
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
