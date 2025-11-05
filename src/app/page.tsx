"use client";

import { useState } from "react";
import { HeroCarousel } from "@/components/sections/hero-carousel";
import { CategoriesStrip } from "@/components/sections/categories-strip";
import { ProductGrid } from "@/components/products/product-grid";
import { QuickViewModal } from "@/components/products/quick-view-modal";
import { AnimatedButton } from "@/components/ui/animated-button";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

// Force dynamic rendering to avoid i18n SSR issues
export const dynamic = "force-dynamic";

// Mock data - in production, fetch from API
const featuredProducts = Array.from({ length: 20 }, (_, i) => ({
  id: `featured-${i + 1}`,
  name: `Featured Product ${i + 1}`,
  nameAm: `ታዋቂ ምርት ${i + 1}`,
  price: 500 + i * 50,
  comparePrice: 700 + i * 50,
  image: `https://via.placeholder.com/400/400?text=Product+${i + 1}`,
  rating: 4.5 + Math.random() * 0.5,
  reviews: Math.floor(Math.random() * 200) + 10,
  vendor: `Vendor ${(i % 5) + 1}`,
  vendorId: `vendor-${(i % 5) + 1}`,
  inStock: true,
  stock: 50 + i * 5,
  shipping: "Free shipping over ETB 500",
  isNew: i < 5,
  isFeatured: i < 10,
}));

const trendingProducts = Array.from({ length: 15 }, (_, i) => ({
  id: `trending-${i + 1}`,
  name: `Trending Product ${i + 1}`,
  nameAm: `በአሁኑ ጊዜ ታዋቂ ${i + 1}`,
  price: 800 + i * 40,
  image: `https://via.placeholder.com/400/400?text=Trending+${i + 1}`,
  rating: 4.6 + Math.random() * 0.4,
  reviews: Math.floor(Math.random() * 300) + 20,
  vendor: `Vendor ${(i % 4) + 1}`,
  inStock: true,
  stock: 30 + i * 3,
  shipping: "Fast delivery",
  isNew: i % 3 === 0,
}));

const bestSellerProducts = Array.from({ length: 18 }, (_, i) => ({
  id: `bestseller-${i + 1}`,
  name: `Best Seller ${i + 1}`,
  nameAm: `ከፍተኛ ሻጭ ${i + 1}`,
  price: 600 + i * 35,
  comparePrice: 900 + i * 35,
  image: `https://via.placeholder.com/400/400?text=BestSeller+${i + 1}`,
  rating: 4.7 + Math.random() * 0.3,
  reviews: Math.floor(Math.random() * 500) + 50,
  vendor: `Vendor ${(i % 6) + 1}`,
  inStock: true,
  stock: 100 + i * 10,
  shipping: "Free shipping",
  isFeatured: true,
}));

export default function Home() {
  const [quickViewProduct, setQuickViewProduct] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Carousel */}
      <section className="py-4 md:py-6 bg-background">
        <div className="container px-4 mx-auto">
          <HeroCarousel />
        </div>
      </section>

      {/* Categories Strip */}
      <CategoriesStrip />

      {/* Featured Deals */}
      <section className="py-8 bg-background">
        <div className="container px-4 mx-auto">
          <motion.div
            className="flex justify-between items-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">Flash Deals</h2>
              <p className="text-sm text-muted-foreground">
                Limited-time offers you can&apos;t miss
              </p>
            </div>
            <Link href="/products?filter=sale">
              <AnimatedButton variant="ghost" size="sm">
                View All
                <ChevronRight className="ml-1 w-4 h-4" />
              </AnimatedButton>
            </Link>
          </motion.div>

          <ProductGrid
            products={featuredProducts.slice(0, 10)}
            columns={5}
            onQuickView={setQuickViewProduct}
          />
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-8 bg-muted/30">
        <div className="container px-4 mx-auto">
          <motion.div
            className="flex justify-between items-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">Trending Now</h2>
              <p className="text-sm text-muted-foreground">
                Popular picks from our community
              </p>
            </div>
            <Link href="/products?sort=trending">
              <AnimatedButton variant="ghost" size="sm">
                View All
                <ChevronRight className="ml-1 w-4 h-4" />
              </AnimatedButton>
            </Link>
          </motion.div>

          <ProductGrid
            products={trendingProducts.slice(0, 10)}
            columns={5}
            onQuickView={setQuickViewProduct}
          />
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-8 bg-background">
        <div className="container px-4 mx-auto">
          <motion.div
            className="flex justify-between items-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">Best Sellers</h2>
              <p className="text-sm text-muted-foreground">
                Top-rated products loved by customers
              </p>
            </div>
            <Link href="/products?sort=rating">
              <AnimatedButton variant="ghost" size="sm">
                View All
                <ChevronRight className="ml-1 w-4 h-4" />
              </AnimatedButton>
            </Link>
          </motion.div>

          <ProductGrid
            products={bestSellerProducts.slice(0, 10)}
            columns={5}
            onQuickView={setQuickViewProduct}
          />
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        productId={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        product={
          quickViewProduct
            ? [
                ...featuredProducts,
                ...trendingProducts,
                ...bestSellerProducts,
              ].find((p) => p.id === quickViewProduct)
            : undefined
        }
      />
    </div>
  );
}
