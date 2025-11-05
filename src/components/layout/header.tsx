"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/lib/store/cart";
import {
  ShoppingCart,
  Search,
  User,
  Menu,
  Globe,
  Heart,
  Bell,
} from "lucide-react";
import { useState } from "react";
import { CartDrawer } from "@/components/cart/cart-drawer";
import LanguageSwitcher from "@/components/language-switcher";
import { MegaMenu } from "@/components/layout/mega-menu";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const { data: session, status } = useSession();
  const { getTotalItems, currency, setCurrency } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showCategoryDrawer, setShowCategoryDrawer] = useState(false);

  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-ethiopian supports-backdrop-filter:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center space-x-3 group">
              <Image
                src="/logo.svg"
                alt="EthioShop Logo"
                width={40}
                height={40}
                className="group-hover:scale-110 transition-transform duration-200"
              />
              <span className="text-xl font-bold text-gradient-primary group-hover:scale-105 transition-transform duration-200">
                EthioShop
              </span>
            </Link>
          </motion.div>

          {/* Search Bar - AliExpress style large */}
          <motion.div
            className="hidden md:flex flex-1 max-w-2xl mx-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <form
              className="relative w-full group"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const input = form.querySelector(
                  "input[name=search]"
                ) as HTMLInputElement | null;
                const q = (input?.value || "").trim();
                const url = q
                  ? `/products?search=${encodeURIComponent(q)}`
                  : "/products";
                window.location.href = url;
              }}
            >
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
              <Input
                name="search"
                placeholder="Search for products, brands, and more..."
                className="pl-12 pr-20 h-12 text-base focus-ring rounded-lg border-2 border-transparent focus:border-primary/30 transition-all duration-200 shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                Search
              </button>
            </form>
          </motion.div>

          {/* Navigation */}
          <motion.nav
            className="hidden md:flex items-center space-x-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div
              className="relative"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <button className="text-sm font-medium hover:text-primary transition-colors relative group flex items-center gap-1">
                <Menu className="h-4 w-4" />
                Categories
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-200"></span>
              </button>
              <AnimatePresence>
                {showMegaMenu && <MegaMenu onClose={() => setShowMegaMenu(false)} />}
              </AnimatePresence>
            </div>
            <Link
              href="/products"
              className="text-sm font-medium hover:text-primary transition-colors relative group"
            >
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link
              href="/vendors"
              className="text-sm font-medium hover:text-primary transition-colors relative group"
            >
              Vendors
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-200"></span>
            </Link>
            {session?.user?.role === "VENDOR" && (
              <Link
                href="/vendor/dashboard"
                className="text-sm font-medium hover:text-primary transition-colors relative group"
              >
                Seller Center
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-200"></span>
              </Link>
            )}
          </motion.nav>

          {/* Right Side Actions */}
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Currency Selector */}
            <div className="hidden sm:flex items-center space-x-1 bg-muted rounded-lg p-1">
              <AnimatedButton
                variant={currency === "ETB" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setCurrency("ETB")}
                className="px-3 py-1 text-xs"
              >
                ETB
              </AnimatedButton>
              <AnimatedButton
                variant={currency === "USD" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setCurrency("USD")}
                className="px-3 py-1 text-xs"
              >
                USD
              </AnimatedButton>
            </div>

            {/* Language Selector */}
            <LanguageSwitcher />

            {/* Wishlist */}
            <AnimatedButton
              variant="ghost"
              size="icon"
              className="hidden sm:flex"
            >
              <Heart className="h-4 w-4" />
            </AnimatedButton>

            {/* Notifications */}
            <AnimatedButton
              variant="ghost"
              size="icon"
              className="hidden sm:flex"
            >
              <Bell className="h-4 w-4" />
            </AnimatedButton>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-md hover:bg-muted"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Menu */}
            {status === "loading" ? (
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            ) : session ? (
              <div className="flex items-center space-x-2">
                <Link href="/dashboard">
                  <AnimatedButton variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                  </AnimatedButton>
                </Link>
                <AnimatedButton
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                >
                  Sign Out
                </AnimatedButton>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <AnimatedButton variant="ghost" size="sm">
                    Sign In
                  </AnimatedButton>
                </Link>
                <Link href="/auth/signup">
                  <AnimatedButton size="sm">Sign Up</AnimatedButton>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <AnimatedButton
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-4 w-4" />
            </AnimatedButton>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden border-t bg-background/95 backdrop-blur-ethiopian"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="py-4 px-4 space-y-4">
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10 focus-ring rounded-full"
                  />
                </motion.div>

                <motion.nav
                  className="flex flex-col space-y-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link
                    href="/products"
                    className="text-sm font-medium hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Products
                  </Link>
                  <Link
                    href="/categories"
                    className="text-sm font-medium hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Categories
                  </Link>
                  <Link
                    href="/vendors"
                    className="text-sm font-medium hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Vendors
                  </Link>
                </motion.nav>

                {/* Mobile Currency Selector */}
                <motion.div
                  className="flex items-center space-x-2 pt-4 border-t"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-sm text-muted-foreground">
                    Currency:
                  </span>
                  <div className="flex space-x-1">
                    <AnimatedButton
                      variant={currency === "ETB" ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setCurrency("ETB")}
                      className="px-3 py-1 text-xs"
                    >
                      ETB
                    </AnimatedButton>
                    <AnimatedButton
                      variant={currency === "USD" ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setCurrency("USD")}
                      className="px-3 py-1 text-xs"
                    >
                      USD
                    </AnimatedButton>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
