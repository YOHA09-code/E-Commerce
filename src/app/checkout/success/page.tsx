"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import { CheckCircle, Package, Truck, Home, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

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
    address1: string;
    city: string;
    region: string;
    phone: string;
  };
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get("order_id");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId && !sessionId) {
        setLoading(false);
        return;
      }

      try {
        let response;

        if (orderId) {
          // Direct order ID
          response = await fetch(`/api/orders/${orderId}`);
        } else if (sessionId) {
          // Stripe session ID - verify payment first
          const paymentResponse = await fetch(
            `/api/payments/stripe?session_id=${sessionId}`
          );
          if (paymentResponse.ok) {
            // Get order from payment metadata
            const payment = await paymentResponse.json();
            response = await fetch(`/api/orders/${payment.orderId}`);
          }
        }

        if (response?.ok) {
          const orderData = await response.json();
          setOrder(orderData);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-8">
            We couldn't find the order you're looking for.
          </p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. We've received your order and will
              process it shortly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                  <CardDescription>Order #{order.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Order Status</span>
                    <Badge
                      variant={
                        order.status === "CONFIRMED"
                          ? "default"
                          : order.status === "SHIPPED"
                          ? "secondary"
                          : order.status === "DELIVERED"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium">Order Date</span>
                    <span>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Amount</span>
                    <span className="text-lg font-bold">
                      {formatPrice(order.total, order.currency)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                      >
                        <img
                          src={
                            item.product.images[0] || "/api/placeholder/80/80"
                          }
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.product.name}</h3>
                          {item.product.nameAm && (
                            <p className="text-sm text-muted-foreground">
                              {item.product.nameAm}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatPrice(
                              item.price * item.quantity,
                              order.currency
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">
                      {order.shippingAddress.firstName}{" "}
                      {order.shippingAddress.lastName}
                    </p>
                    <p>{order.shippingAddress.address1}</p>
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.region}
                    </p>
                    <p className="text-muted-foreground">
                      {order.shippingAddress.phone}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>What's Next?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Order Processing</h3>
                      <p className="text-sm text-muted-foreground">
                        We're preparing your order for shipment.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Truck className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Shipping</h3>
                      <p className="text-sm text-muted-foreground">
                        Your order will be shipped within 1-2 business days.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Delivery</h3>
                      <p className="text-sm text-muted-foreground">
                        Expected delivery in 3-5 business days.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Link href="/orders" className="block">
                  <Button className="w-full">
                    <Package className="mr-2 h-4 w-4" />
                    View Order Details
                  </Button>
                </Link>

                <Link href="/products" className="block">
                  <Button variant="outline" className="w-full">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>

                <Link href="/" className="block">
                  <Button variant="ghost" className="w-full">
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Button>
                </Link>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you have any questions about your order, please contact
                    our support team.
                  </p>
                  <Link href="/contact">
                    <Button variant="outline" size="sm" className="w-full">
                      Contact Support
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
