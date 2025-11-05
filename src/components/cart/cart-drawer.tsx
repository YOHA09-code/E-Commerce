"use client";

import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { AnimatedButton } from "@/components/ui/animated-button";
import { X, Trash2, Minus, Plus, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, currency, updateQuantity, removeItem, getTotalPrice } =
    useCartStore();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-2xl flex flex-col"
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "tween", duration: 0.25 }}
            role="dialog"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Your Cart</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-muted"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {items.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Cart is empty
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="flex gap-3"
                    >
                      <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-medium truncate">{item.name}</p>
                            {item.nameAm && (
                              <p className="text-xs text-muted-foreground font-ethiopic truncate">
                                {item.nameAm}
                              </p>
                            )}
                          </div>
                          <button
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              removeItem(item.productId, item.variantId)
                            }
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              className="h-7 w-7 inline-flex items-center justify-center rounded-md border hover:bg-muted"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1,
                                  item.variantId
                                )
                              }
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              className="h-7 w-7 inline-flex items-center justify-center rounded-md border hover:bg-muted"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1,
                                  item.variantId
                                )
                              }
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="text-sm font-semibold">
                            {formatPrice(item.price * item.quantity, currency)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(getTotalPrice(), currency)}
                </span>
              </div>
              <div className="flex gap-2">
                <Link href="/cart" className="flex-1" onClick={onClose}>
                  <AnimatedButton variant="outline" className="w-full">
                    View Cart
                  </AnimatedButton>
                </Link>
                <Link href="/checkout" className="flex-1" onClick={onClose}>
                  <AnimatedButton className="w-full">Checkout</AnimatedButton>
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
