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
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  Plus,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  ArrowLeft,
  Settings,
  Bell,
  Search,
} from "lucide-react";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Mock data - in real app, this would come from API
const mockStats = {
  totalUsers: 1250,
  totalVendors: 45,
  totalProducts: 1200,
  totalOrders: 3200,
  totalRevenue: 2500000,
  monthlyRevenue: 450000,
  pendingOrders: 25,
  lowStockProducts: 12,
  newUsersThisMonth: 180,
  activeVendors: 38,
};

const mockRecentOrders = [
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

const mockRecentUsers = [
  {
    id: "1",
    name: "Alemayehu Bekele",
    email: "alemayehu@example.com",
    role: "CUSTOMER",
    joinDate: "2024-01-15",
    status: "ACTIVE",
  },
  {
    id: "2",
    name: "Tigist Haile",
    email: "tigist@example.com",
    role: "VENDOR",
    joinDate: "2024-01-14",
    status: "ACTIVE",
  },
  {
    id: "3",
    name: "Yonas Tesfaye",
    email: "yonas@example.com",
    role: "CUSTOMER",
    joinDate: "2024-01-13",
    status: "ACTIVE",
  },
];

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("overview");

  if (!session || session.user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-warm pattern-overlay">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto w-32 h-32 bg-gradient-ethiopian rounded-full flex items-center justify-center mb-8">
            <AlertTriangle className="h-16 w-16 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gradient-primary">
            Access Denied
          </h1>
          <p className="text-muted-foreground text-lg">
            You need admin privileges to access this page.
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
                Admin Dashboard
              </h1>
              <h1 className="text-3xl font-bold font-ethiopic">
                የአስተዳደር ዳሽቦርድ
              </h1>
              <p className="text-muted-foreground text-lg mt-2">
                Manage your e-commerce platform and monitor performance
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
                  Total Users
                </CardTitle>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {mockStats.totalUsers}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{mockStats.newUsersThisMonth} this month
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
                  Total Vendors
                </CardTitle>
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <Package className="h-5 w-5 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">
                  {mockStats.totalVendors}
                </div>
                <p className="text-xs text-muted-foreground">
                  {mockStats.activeVendors} active
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
                  Pending Orders
                </CardTitle>
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {mockStats.pendingOrders}
                </div>
                <p className="text-xs text-muted-foreground">
                  {mockStats.lowStockProducts} low stock alerts
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
            <TabsList className="grid w-full grid-cols-5 backdrop-blur-ethiopian bg-background/95 shadow-lg">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Users
              </TabsTrigger>
              <TabsTrigger
                value="vendors"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Vendors
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
                        {mockRecentOrders.map((order, index) => (
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

                {/* Recent Users */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <Card className="backdrop-blur-ethiopian bg-background/95 shadow-2xl border-0">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Users className="h-6 w-6 text-primary" />
                        Recent Users
                      </CardTitle>
                      <CardDescription>New user registrations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockRecentUsers.map((user, index) => (
                          <motion.div
                            key={user.id}
                            className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={
                                  user.role === "VENDOR" ? "default" : "outline"
                                }
                              >
                                {user.role}
                              </Badge>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(new Date(user.joinDate))}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <motion.div
                className="flex justify-between items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gradient-primary">
                  User Management
                </h2>
                <AnimatedButton>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </AnimatedButton>
              </motion.div>

              <Card className="backdrop-blur-ethiopian bg-background/95 shadow-2xl border-0">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {mockRecentUsers.map((user, index) => (
                      <motion.div
                        key={user.id}
                        className="flex items-center justify-between p-6 border rounded-xl hover:bg-muted/30 transition-colors"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-lg">{user.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              user.role === "VENDOR" ? "default" : "outline"
                            }
                          >
                            {user.role}
                          </Badge>
                          <AnimatedButton variant="outline" size="sm">
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </AnimatedButton>
                          <AnimatedButton variant="outline" size="sm">
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                          </AnimatedButton>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vendors" className="space-y-6">
              <motion.div
                className="flex justify-between items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gradient-primary">
                  Vendor Management
                </h2>
                <AnimatedButton>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vendor
                </AnimatedButton>
              </motion.div>

              <Card className="backdrop-blur-ethiopian bg-background/95 shadow-2xl border-0">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {mockRecentUsers
                      .filter((user) => user.role === "VENDOR")
                      .map((vendor, index) => (
                        <motion.div
                          key={vendor.id}
                          className="flex items-center justify-between p-6 border rounded-xl hover:bg-muted/30 transition-colors"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                              <Package className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                              <p className="font-medium text-lg">
                                {vendor.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {vendor.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="default">VENDOR</Badge>
                            <AnimatedButton variant="outline" size="sm">
                              <Eye className="mr-1 h-3 w-3" />
                              View
                            </AnimatedButton>
                            <AnimatedButton variant="outline" size="sm">
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </AnimatedButton>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <motion.h2
                className="text-3xl font-bold text-gradient-primary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Order Management
              </motion.h2>
              <div className="space-y-4">
                {mockRecentOrders.map((order, index) => (
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
                      <CardDescription>
                        Revenue and sales performance
                      </CardDescription>
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
                        User Growth
                      </CardTitle>
                      <CardDescription>
                        User registration trends
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg">
                          User growth chart will be displayed here
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Card className="backdrop-blur-ethiopian bg-background/95 shadow-2xl border-0">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <PieChart className="h-6 w-6 text-primary" />
                        Product Categories
                      </CardTitle>
                      <CardDescription>
                        Product distribution by category
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <PieChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg">
                          Category distribution chart will be displayed here
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Card className="backdrop-blur-ethiopian bg-background/95 shadow-2xl border-0">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Activity className="h-6 w-6 text-primary" />
                        System Health
                      </CardTitle>
                      <CardDescription>
                        Platform performance metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg">
                          System health metrics will be displayed here
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
