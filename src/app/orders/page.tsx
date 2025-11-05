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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  Package,
  Search,
  Eye,
  Download,
  Filter,
  Calendar,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

interface Order {
  id: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
  orderItems: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      nameAm?: string;
      images: string[];
    };
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    city: string;
    region: string;
  };
  payments: Array<{
    id: string;
    status: string;
    amount: number;
    currency: string;
    provider: string;
  }>;
}

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (session) {
      fetchOrders();
    }
  }, [session, statusFilter]);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await fetch(`/api/orders?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PENDING":
        return "destructive";
      case "CONFIRMED":
        return "default";
      case "PROCESSING":
        return "secondary";
      case "SHIPPED":
        return "outline";
      case "DELIVERED":
        return "default";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-red-600";
      case "CONFIRMED":
        return "text-blue-600";
      case "PROCESSING":
        return "text-orange-600";
      case "SHIPPED":
        return "text-purple-600";
      case "DELIVERED":
        return "text-green-600";
      case "CANCELLED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.lastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-8">
            Please sign in to view your orders.
          </p>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders by ID or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "PENDING" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("PENDING")}
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === "SHIPPED" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("SHIPPED")}
            >
              Shipped
            </Button>
            <Button
              variant={statusFilter === "DELIVERED" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("DELIVERED")}
            >
              Delivered
            </Button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "No orders match your current filters."
                  : "You haven't placed any orders yet."}
              </p>
              <Link href="/products">
                <Button>Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {order.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(new Date(order.createdAt))}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <span>
                            {order.orderItems.length} item
                            {order.orderItems.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-medium">
                            {formatPrice(order.total, order.currency)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground">
                          Shipping to: {order.shippingAddress.firstName}{" "}
                          {order.shippingAddress.lastName},{" "}
                          {order.shippingAddress.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </Link>

                      {order.payments.length > 0 &&
                        order.payments[0].status === "COMPLETED" && (
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Invoice
                          </Button>
                        )}
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex gap-3 overflow-x-auto">
                      {order.orderItems.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 min-w-0 flex-shrink-0"
                        >
                          <img
                            src={
                              item.product.images[0] || "/api/placeholder/40/40"
                            }
                            alt={item.product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.orderItems.length > 3 && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          +{order.orderItems.length - 3} more items
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
