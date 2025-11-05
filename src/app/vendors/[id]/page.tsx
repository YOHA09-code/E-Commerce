"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/products/product-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedButton } from "@/components/ui/animated-button";
import { motion } from "framer-motion";
import {
  Star,
  Package,
  Users,
  Shield,
  MessageCircle,
  Store,
  CheckCircle,
} from "lucide-react";
import { Loader2 } from "lucide-react";

export default function VendorShopPage() {
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState<any | null>(null);

  useEffect(() => {
    // In production, fetch vendor data from API
    setTimeout(() => {
      setVendor({
        id: params.id,
        businessName: "Ethiopian Coffee Co.",
        businessNameAm: "ኢትዮጵያዊ ቡና ኩባንያ",
        description: "Premium Ethiopian coffee beans and products",
        rating: 4.8,
        totalProducts: 124,
        followers: 1560,
        verified: true,
        joinedDate: "2023-01-15",
      });
      setLoading(false);
    }, 500);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold">Vendor not found</h1>
      </div>
    );
  }

  // Mock products for this vendor
  const vendorProducts = Array.from({ length: 20 }, (_, i) => ({
    id: `vendor-${params.id}-${i + 1}`,
    name: `Product ${i + 1}`,
    price: 400 + i * 25,
    image: `https://via.placeholder.com/400/400?text=Product+${i + 1}`,
    rating: 4.5 + Math.random() * 0.5,
    reviews: Math.floor(Math.random() * 200),
    vendor: vendor.businessName,
    vendorId: vendor.id,
    inStock: true,
    stock: 50,
    shipping: "Free shipping",
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Vendor Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-0">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Store className="h-12 w-12 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{vendor.businessName}</h1>
                  {vendor.verified && (
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                {vendor.businessNameAm && (
                  <p className="text-lg text-muted-foreground font-ethiopic mb-2">
                    {vendor.businessNameAm}
                  </p>
                )}
                <p className="text-muted-foreground mb-4">{vendor.description}</p>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{vendor.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {vendor.totalProducts} Products
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {vendor.followers} Followers
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Member since {new Date(vendor.joinedDate).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
              <Link href={`/messages/new?vendorId=${vendor.id}`}>
                <AnimatedButton size="lg">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Seller
                </AnimatedButton>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Products */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Products</h2>
        <ProductGrid products={vendorProducts} columns={5} />
      </div>
    </div>
  );
}

