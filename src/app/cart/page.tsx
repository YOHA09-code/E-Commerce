"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  Shield,
  Truck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const {
    items,
    currency,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
  } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-warm pattern-overlay">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="mx-auto w-32 h-32 bg-gradient-ethiopian rounded-full flex items-center justify-center mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ShoppingBag className="h-16 w-16 text-primary-foreground" />
            </motion.div>
            <motion.h1
              className="text-4xl font-bold mb-4 text-gradient-primary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Your cart is empty
            </motion.h1>
            <motion.p
              className="text-muted-foreground mb-8 text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Looks like you haven't added any items to your cart yet.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link href="/products">
                <AnimatedButton size="lg" className="h-14 px-8 text-lg">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Continue Shopping
                </AnimatedButton>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm pattern-overlay">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/products">
            <AnimatedButton variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </AnimatedButton>
          </Link>
          <h1 className="text-4xl font-bold text-gradient-primary">
            Shopping Cart
          </h1>
          <h1 className="text-3xl font-bold font-ethiopic">የግዢ ቅርጫት</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div
            className="lg:col-span-2 space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={`${item.productId}-${item.variantId}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="card-hover">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          {item.nameAm && (
                            <p className="text-sm text-muted-foreground font-ethiopic">
                              {item.nameAm}
                            </p>
                          )}
                          {item.variantName && item.variantValue && (
                            <p className="text-sm text-muted-foreground">
                              {item.variantName}: {item.variantValue}
                            </p>
                          )}
                          <p className="text-xl font-bold mt-2 text-primary">
                            {formatPrice(item.price, currency)}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            <AnimatedButton
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1,
                                  item.variantId
                                )
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </AnimatedButton>

                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  item.productId,
                                  parseInt(e.target.value) || 0,
                                  item.variantId
                                )
                              }
                              className="w-16 text-center"
                              min="1"
                              max={item.stock}
                            />

                            <AnimatedButton
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1,
                                  item.variantId
                                )
                              }
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="h-4 w-4" />
                            </AnimatedButton>
                          </div>

                          <AnimatedButton
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeItem(item.productId, item.variantId)
                            }
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </AnimatedButton>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            <motion.div
              className="flex justify-between items-center pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <AnimatedButton variant="outline" onClick={clearCart}>
                Clear Cart
              </AnimatedButton>
              <p className="text-sm text-muted-foreground">
                {items.length} item{items.length !== 1 ? "s" : ""} in cart
              </p>
            </motion.div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="sticky top-8 backdrop-blur-ethiopian bg-background/95 shadow-2xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Order Summary</CardTitle>
                <CardTitle className="text-xl font-ethiopic">
                  የትዕዛዝ ማጠቃለያ
                </CardTitle>
                <CardDescription>
                  Review your order before checkout
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      {formatPrice(getTotalPrice(), currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="font-semibold">
                      {formatPrice(getTotalPrice() * 0.15, currency)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatPrice(getTotalPrice() * 1.15, currency)}
                  </span>
                </div>

                <div className="space-y-3">
                  <Link href="/checkout" className="block">
                    <AnimatedButton className="w-full h-12 text-lg font-medium">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Proceed to Checkout
                    </AnimatedButton>
                  </Link>
                  <Link href="/products">
                    <AnimatedButton variant="outline" className="w-full h-12">
                      Continue Shopping
                    </AnimatedButton>
                  </Link>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>
                      Secure checkout with Chapa (ETB) or Stripe (USD)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span>
                      Free shipping on orders over {formatPrice(1000, currency)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
