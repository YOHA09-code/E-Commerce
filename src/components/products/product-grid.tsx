"use client";

import { ProductCard } from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  name: string;
  nameAm?: string;
  price: number;
  comparePrice?: number;
  image: string;
  images?: string[];
  rating?: number;
  reviews?: number;
  vendor?: string;
  vendorId?: string;
  inStock?: boolean;
  stock?: number;
  shipping?: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

interface ProductGridProps {
  products: Product[];
  columns?: number;
  onQuickView?: (productId: string) => void;
  loading?: boolean;
}

export function ProductGrid({
  products,
  columns = 5,
  onQuickView,
  loading = false,
}: ProductGridProps) {
  if (loading) {
    const gridCols = {
      2: "grid-cols-2",
      3: "sm:grid-cols-3",
      4: "md:grid-cols-4",
      5: "lg:grid-cols-5",
    };
    return (
      <div
        className={`grid grid-cols-2 ${gridCols[3]} ${gridCols[4]} ${gridCols[5]} gap-4`}
      >
        {[...Array(12)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-${columns} gap-4`}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={{ ...product, index }}
          onQuickView={onQuickView}
          dense={true}
        />
      ))}
    </div>
  );
}

