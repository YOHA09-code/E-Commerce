"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Eye, Heart, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { toast } from "react-hot-toast";

interface ProductCardProps {
  product: {
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
    index?: number;
  };
  onQuickView?: (productId: string) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isHovered, setIsHovered] = useState(false);
  const currency = useCartStore((state) => state.currency);

  const rating = product.rating || 0;
  const reviews = product.reviews || 0;
  const inStock = product.inStock !== false && (product.stock ?? 0) > 0;


  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (product.index || 0) * 0.05 }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`} className="block h-full">
        <div className="flex overflow-hidden relative flex-col h-full rounded-lg border transition-all duration-300 bg-background hover:shadow-lg">
          {/* Image Container */}
          <div className="overflow-hidden relative w-full aspect-square bg-muted">
            <Image
              src={product.image || product.images?.[0] || "https://via.placeholder.com/400/400"}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className={`object-cover transition-transform duration-300 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
              loading="lazy"
            />

            {/* Badges */}
            <div className="flex absolute top-2 left-2 z-10 flex-col gap-1">
              {product.isNew && (
                <Badge className="bg-green-500 text-white text-xs px-2 py-0.5">
                  New
                </Badge>
              )}
              {product.isFeatured && (
                <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0.5">
                  Hot
                </Badge>
              )}
              {discount > 0 && (
                <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">
                  -{discount}%
                </Badge>
              )}
            </div>

            {/* Hover Actions */}
            <motion.div
              className="flex absolute top-2 right-2 z-10 flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="flex justify-center items-center w-8 h-8 rounded-full shadow-md transition-colors bg-white/90 hover:bg-white"
                aria-label="Add to wishlist"
              >
                <Heart className="w-4 h-4 text-gray-700" />
              </button>
              {onQuickView && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onQuickView(product.id);
                  }}
                  className="flex justify-center items-center w-8 h-8 rounded-full shadow-md transition-colors bg-white/90 hover:bg-white"
                  aria-label="Quick view"
                >
                  <Eye className="w-4 h-4 text-gray-700" />
                </button>
              )}
            </motion.div>

            {/* Out of Stock Overlay */}
            {!inStock && (
              <div className="flex absolute inset-0 z-20 justify-center items-center bg-black/40">
                <Badge variant="destructive" className="text-sm">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-3">
            {/* Title */}
            <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            {product.nameAm && (
              <p className="mb-2 text-xs text-muted-foreground font-ethiopic line-clamp-1">
                {product.nameAm}
              </p>
            )}

            {/* Rating */}
            {rating > 0 && (
              <div className="flex gap-1 items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-1 text-xs text-muted-foreground">
                  {rating.toFixed(1)} ({reviews})
                </span>
              </div>
            )}

            {/* Vendor */}
            {product.vendor && (
              <p className="mb-2 text-xs truncate text-muted-foreground">
                {product.vendor}
              </p>
            )}

            {/* Price */}
            <div className="mt-auto space-y-1">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-lg font-bold text-primary">
                  {formatPrice(product.price, currency)}
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-xs line-through text-muted-foreground">
                    {formatPrice(product.comparePrice, currency)}
                  </span>
                )}
              </div>

              {/* Shipping Hint */}
              <div className="flex gap-1 items-center text-xs text-green-600">
                <Truck className="w-3 h-3" />
                <span>{product.shipping || "Free shipping over ETB 500"}</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              className="flex gap-1 justify-center items-center px-3 py-2 mt-2 w-full text-sm font-medium rounded-md transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!inStock}
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                addItem({
                  id: product.id,
                  productId: product.id,
                  name: product.name,
                  nameAm: product.nameAm,
                  price: product.price,
                  image: product.image || product.images?.[0] || "https://via.placeholder.com/400/400",
                  stock: product.stock ?? 0,
                });
                toast.success("Added to cart");
              }}
            >
              <ShoppingCart className="w-3 h-3" />
              {inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}


