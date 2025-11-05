"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Loader2,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  Heart,
  Share2,
  MessageCircle,
  CheckCircle,
  Package,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { ProductGrid } from "@/components/products/product-grid";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const currency = useCartStore((state) => state.currency);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) throw new Error("Failed to load product");
        const data = await res.json();
        setProduct(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  const images: string[] =
    product.images && product.images.length > 0
      ? product.images
      : ["https://via.placeholder.com/600/600"];
  const variants = product.variants || [];
  const rating = product.rating || 4.5;
  const reviews = product.reviews || [];

  const addToCart = () => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      nameAm: product.nameAm,
      price: Number(product.price || 0),
      image: images[0],
      stock: product.stock ?? 0,
      variantId: selectedVariant || undefined,
    });
    toast.success("Added to cart");
  };

  const relatedProducts = Array.from({ length: 8 }, (_, i) => ({
    id: `related-${i + 1}`,
    name: `Related Product ${i + 1}`,
    price: 400 + i * 30,
    image: `https://via.placeholder.com/400/400?text=Related+${i + 1}`,
    rating: 4.2 + Math.random() * 0.6,
    reviews: Math.floor(Math.random() * 100),
    vendor: "Related Vendor",
    inStock: true,
    stock: 20,
    shipping: "Free shipping",
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Gallery */}
        <div>
          <div className="relative w-full aspect-square rounded-xl overflow-hidden border bg-muted mb-4">
            <Image
              src={images[selectedImage] || images[0]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.slice(0, 5).map((src: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i
                      ? "border-primary"
                      : "border-transparent hover:border-primary/50"
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {product.name}
            </h1>
            {product.nameAm && (
              <p className="text-muted-foreground font-ethiopic mb-4 text-lg">
                {product.nameAm}
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-medium">
                {rating.toFixed(1)} ({reviews.length || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(Number(product.price || 0), currency)}
                </span>
                {product.comparePrice &&
                  product.comparePrice > product.price && (
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(Number(product.comparePrice), currency)}
                    </span>
                  )}
              </div>
              {product.comparePrice && (
                <p className="text-sm text-green-600 font-medium">
                  Save {formatPrice(
                    Number(product.comparePrice - product.price),
                    currency
                  )}
                </p>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              {product.stock > 0 ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    In Stock ({product.stock} available)
                  </span>
                </>
              ) : (
                <>
                  <Package className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium text-red-600">
                    Out of Stock
                  </span>
                </>
              )}
            </div>

            {/* Variants */}
            {variants.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Select Variant
                </label>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant: any) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        selectedVariant === variant.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {variant.value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping Options */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="font-medium">Shipping</span>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground ml-7">
                  <li>Free shipping on orders over ETB 500</li>
                  <li>Standard delivery: 3-5 business days</li>
                  <li>Express delivery available</li>
                </ul>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center gap-3 mb-6">
              <AnimatedButton
                size="lg"
                onClick={addToCart}
                disabled={!product.stock || product.stock === 0}
                className="flex-1"
              >
                <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
              </AnimatedButton>
              <AnimatedButton size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </AnimatedButton>
              <AnimatedButton size="lg" variant="outline">
                <Share2 className="h-5 w-5" />
              </AnimatedButton>
            </div>

            {/* Security Badges */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Seller Card */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">
                  {product.vendor?.businessName?.[0] || "V"}
                </span>
              </div>
              <div>
                <h3 className="font-semibold">
                  {product.vendor?.businessName || "Vendor Store"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {product.vendor?.verified ? "Verified Seller" : "Seller"}
                </p>
              </div>
            </div>
            <Link href={`/messages/new?vendorId=${product.vendorId}`}>
              <AnimatedButton variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Seller
              </AnimatedButton>
            </Link>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Tabs: Description, Reviews, Shipping */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length || 0})</TabsTrigger>
          <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="prose max-w-none">
                <p className="text-muted-foreground whitespace-pre-line">
                  {product.description || "No description available."}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardContent className="p-6">
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review: any, i: number) => (
                    <div key={i} className="border-b last:border-0 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            className={`h-4 w-4 ${
                              j < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="font-medium">{review.user?.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.comment || review.commentAm}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="shipping" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Shipping Options</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Standard Shipping: 3-5 business days</li>
                    <li>• Express Shipping: 1-2 business days</li>
                    <li>• Free shipping on orders over ETB 500</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Returns Policy</h4>
                  <p className="text-sm text-muted-foreground">
                    30-day return policy. Items must be unused and in original
                    packaging.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <section>
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <ProductGrid products={relatedProducts} columns={5} />
      </section>
    </div>
  );
}
