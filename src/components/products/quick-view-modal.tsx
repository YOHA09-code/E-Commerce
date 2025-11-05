"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface QuickViewModalProps {
  productId: string | null;
  onClose: () => void;
  product?: {
    id: string;
    name: string;
    nameAm?: string;
    description?: string;
    price: number;
    comparePrice?: number;
    images?: string[];
    image?: string;
    rating?: number;
    reviews?: number;
    vendor?: string;
    inStock?: boolean;
    stock?: number;
    variants?: Array<{ id: string; name: string; value: string }>;
  };
}

export function QuickViewModal({
  productId,
  onClose,
  product,
}: QuickViewModalProps) {
  const addItem = useCartStore((state) => state.addItem);
  const currency = useCartStore((state) => state.currency);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product || !productId) return null;

  const images = product.images || (product.image ? [product.image] : []);
  const rating = product.rating || 0;
  const reviews = product.reviews || 0;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      nameAm: product.nameAm,
      price: product.price,
      image: images[0] || "https://via.placeholder.com/400/400",
      stock: product.stock ?? 0,
    });
    toast.success("Added to cart");
  };

  return (
    <AnimatePresence>
      {productId && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-background rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative p-6">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center z-10"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Images */}
                  <div>
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-muted">
                      {images[selectedImage] && (
                        <Image
                          src={images[selectedImage]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    {images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {images.slice(0, 4).map((src, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedImage(i)}
                            className={`relative aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                              selectedImage === i
                                ? "border-primary"
                                : "border-transparent"
                            }`}
                          >
                            <Image
                              src={src}
                              alt={`${product.name} ${i + 1}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                    {product.nameAm && (
                      <p className="text-muted-foreground font-ethiopic mb-4">
                        {product.nameAm}
                      </p>
                    )}

                    {/* Rating */}
                    {rating > 0 && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {rating.toFixed(1)} ({reviews} reviews)
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl font-bold text-primary">
                          {formatPrice(product.price, currency)}
                        </span>
                        {product.comparePrice &&
                          product.comparePrice > product.price && (
                            <span className="text-lg text-muted-foreground line-through">
                              {formatPrice(product.comparePrice, currency)}
                            </span>
                          )}
                      </div>
                    </div>

                    {/* Description */}
                    {product.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {product.description}
                      </p>
                    )}

                    {/* Vendor */}
                    {product.vendor && (
                      <p className="text-sm text-muted-foreground mb-4">
                        Sold by: <span className="font-medium">{product.vendor}</span>
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      <AnimatedButton
                        size="lg"
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                        className="flex-1"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </AnimatedButton>
                      <AnimatedButton variant="outline" size="lg">
                        <Heart className="h-4 w-4 mr-2" />
                      </AnimatedButton>
                    </div>

                    <Link
                      href={`/products/${product.id}`}
                      onClick={onClose}
                      className="block mt-4 text-center text-primary hover:underline text-sm"
                    >
                      View full details →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


