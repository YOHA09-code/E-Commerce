"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  TrendingUp,
  Users,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  ShoppingCart,
  Star,
  ArrowLeft,
  Settings,
  Bell,
  Search,
} from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Mock data - in real app, this would come from API
const mockStats = {
  totalProducts: 24,
  activeProducts: 22,
  totalOrders: 156,
  pendingOrders: 8,
  totalRevenue: 125000,
  monthlyRevenue: 25000,
  averageRating: 4.7,
  totalReviews: 89,
};

const mockProducts = [
  {
    id: "1",
    name: "Ethiopian Coffee Beans",
    nameAm: "ኢትዮጵያዊ ቡና",
    price: 450,
    stock: 50,
    isActive: true,
    image: "/api/placeholder/100/100",
    orders: 23,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Traditional Ethiopian Dress",
    nameAm: "ባህላዊ ኢትዮጵያዊ ልብስ",
    price: 1200,
    stock: 15,
    isActive: true,
    image: "/api/placeholder/100/100",
    orders: 12,
    rating: 4.6,
  },
  {
    id: "3",
    name: "Ethiopian Honey",
    nameAm: "ኢትዮጵያዊ ማር",
    price: 350,
    stock: 0,
    isActive: false,
    image: "/api/placeholder/100/100",
    orders: 8,
    rating: 4.7,
  },
];

const mockOrders = [
  {
    id: "ORD-001",
    customerName: "Alemayehu Bekele",
    total: 1650,
    status: "PENDING",
    date: "2024-01-15",
    items: 2,
  },
  {
    id: "ORD-002",
    customerName: "Tigist Haile",
    total: 800,
    status: "SHIPPED",
    date: "2024-01-14",
    items: 1,
  },
  {
    id: "ORD-003",
    customerName: "Yonas Tesfaye",
    total: 2400,
    status: "DELIVERED",
    date: "2024-01-13",
    items: 3,
  },
];

export default function VendorDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("overview");

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-warm pattern-overlay">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto w-32 h-32 bg-gradient-ethiopian rounded-full flex items-center justify-center mb-8">
            <Package className="h-16 w-16 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gradient-primary">
            Access Denied
          </h1>
          <p className="text-muted-foreground text-lg">
            Please sign in to access the vendor dashboard.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm pattern-overlay">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gradient-primary">
                Vendor Dashboard
              </h1>
              <h1 className="text-3xl font-bold font-ethiopic">የሻጭ ዳሽቦርድ</h1>
              <p className="text-muted-foreground text-lg mt-2">
                Manage your products, orders, and business analytics
              </p>
            </div>
            <div className="flex items-center gap-4">
              <AnimatedButton variant="outline" size="sm">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </AnimatedButton>
              <AnimatedButton variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </AnimatedButton>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="card-hover backdrop-blur-ethiopian bg-background/95 shadow-2xl border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {mockStats.totalProducts}
                </div>
                <p className="text-xs text-muted-foreground">
                  {mockStats.activeProducts} active
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="card-hover backdrop-blur-ethiopian bg-background/95 shadow-2xl border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders
                </CardTitle>
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">
                  {mockStats.totalOrders}
                </div>
                <p className="text-xs text-muted-foreground">
                  {mockStats.pendingOrders} pending
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="card-hover backdrop-blur-ethiopian bg-background/95 shadow-2xl border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {formatPrice(mockStats.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatPrice(mockStats.monthlyRevenue)} this month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="card-hover backdrop-blur-ethiopian bg-background/95 shadow-2xl border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Rating
                </CardTitle>
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">
                  {mockStats.averageRating}
                </div>
                <p className="text-xs text-muted-foreground">
                  {mockStats.totalReviews} reviews
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4 backdrop-blur-ethiopian bg-background/95 shadow-lg">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Products
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <Card className="backdrop-blur-ethiopian bg-background/95 shadow-2xl border-0">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <ShoppingCart className="h-6 w-6 text-primary" />
                        Recent Orders
                      </CardTitle>
                      <CardDescription>
                        Latest orders from customers
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockOrders.slice(0, 5).map((order, index) => (
                          <motion.div
                            key={order.id}
                            className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <div>
                              <p className="font-medium">{order.id}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.customerName}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-primary">
                                {formatPrice(order.total)}
                              </p>
                              <Badge
                                variant={
                                  order.status === "PENDING"
                                    ? "destructive"
                                    : order.status === "SHIPPED"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {order.status}
                              </Badge>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Top Products */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <Card className="backdrop-blur-ethiopian bg-background/95 shadow-2xl border-0">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Star className="h-6 w-6 text-primary" />
                        Top Products
                      </CardTitle>
                      <CardDescription>
                        Your best-selling products
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockProducts.slice(0, 3).map((product, index) => (
                          <motion.div
                            key={product.id}
                            className="flex items-center gap-4 p-4 border rounded-xl hover:bg-muted/30 transition-colors"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground font-ethiopic">
                                {product.nameAm}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {product.orders} orders
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-primary">
                                {formatPrice(product.price)}
                              </p>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">
                                  {product.rating}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <motion.div
                className="flex justify-between items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gradient-primary">
                  Products
                </h2>
                <Link href="/vendor/products/new">
                  <AnimatedButton>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </AnimatedButton>
                </Link>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="card-hover backdrop-blur-ethiopian bg-background/95 shadow-2xl border-0">
                      <div className="aspect-square relative overflow-hidden rounded-t-lg">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        {!product.isActive && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="destructive">Inactive</Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-2 text-lg">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2 font-ethiopic">
                          {product.nameAm}
                        </p>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-primary text-lg">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Stock: {product.stock}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-4">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{product.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({product.orders} orders)
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <AnimatedButton
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </AnimatedButton>
                          <AnimatedButton
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                          </AnimatedButton>
                          <AnimatedButton variant="outline" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </AnimatedButton>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <motion.h2
                className="text-3xl font-bold text-gradient-primary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Orders
              </motion.h2>
              <div className="space-y-4">
                {mockOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="card-hover backdrop-blur-ethiopian bg-background/95 shadow-2xl border-0">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {order.id}
                            </h3>
                            <p className="text-muted-foreground">
                              {order.customerName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.date}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary text-lg">
                              {formatPrice(order.total)}
                            </p>
                            <Badge
                              variant={
                                order.status === "PENDING"
                                  ? "destructive"
                                  : order.status === "SHIPPED"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {order.status}
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                              {order.items} items
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <motion.h2
                className="text-3xl font-bold text-gradient-primary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Analytics
              </motion.h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card className="backdrop-blur-ethiopian bg-background/95 shadow-2xl border-0">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-primary" />
                        Sales Overview
                      </CardTitle>
                      <CardDescription>Your sales performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg">
                          Sales chart will be displayed here
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Card className="backdrop-blur-ethiopian bg-background/95 shadow-2xl border-0">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <TrendingUp className="h-6 w-6 text-primary" />
                        Product Performance
                      </CardTitle>
                      <CardDescription>
                        How your products are performing
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg">
                          Product performance chart will be displayed here
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
