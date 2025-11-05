"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { toast } from "react-hot-toast";
import {
  CreditCard,
  Smartphone,
  Globe,
  Shield,
  Truck,
  CheckCircle,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface AddressForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  region: string;
  postalCode: string;
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, currency, getTotalPrice, clearCart } = useCartStore();

  const [address, setAddress] = useState<AddressForm>({
    firstName: "",
    lastName: "",
    email: session?.user?.email || "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    region: "",
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"chapa" | "stripe">(
    "chapa"
  );
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=/checkout");
      return;
    }

    if (items.length === 0) {
      router.push("/cart");
      return;
    }
  }, [session, items, router]);

  const handleAddressChange = (field: keyof AddressForm, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentMethodChange = (method: "chapa" | "stripe") => {
    setPaymentMethod(method);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Create order
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            variantId: item.variantId,
          })),
          shippingAddress: address,
          billingAddress: address,
          currency,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const order = await orderResponse.json();

      // Process payment
      const paymentResponse = await fetch(`/api/payments/${paymentMethod}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
          amount: getTotalPrice() * 1.15, // Include tax
          email: address.email,
          firstName: address.firstName,
          lastName: address.lastName,
          phone: address.phone,
          currency: currency,
          name: `${address.firstName} ${address.lastName}`,
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error("Failed to process payment");
      }

      const payment = await paymentResponse.json();

      // Redirect to payment gateway
      if (payment.checkoutUrl) {
        window.location.href = payment.checkoutUrl;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to process checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!session || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-warm pattern-overlay">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading checkout...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm pattern-overlay">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/cart">
              <AnimatedButton variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Cart
              </AnimatedButton>
            </Link>
            <h1 className="text-4xl font-bold text-gradient-primary">
              Checkout
            </h1>
            <h1 className="text-3xl font-bold font-ethiopic">መክፈያ</h1>
          </motion.div>

          {/* Stepper */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    1
                  </div>
                  <span className="font-medium">Address</span>
                </div>
                <div className="w-12 h-0.5 bg-primary" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    2
                  </div>
                  <span className="font-medium">Shipping</span>
                </div>
                <div className="w-12 h-0.5 bg-primary" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    3
                  </div>
                  <span className="font-medium">Payment</span>
                </div>
              </div>
            </div>
          </motion.div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Shipping Information */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="backdrop-blur-ethiopian bg-background/95 shadow-2xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-primary" />
                    Shipping Information
                  </CardTitle>
                  <CardTitle className="text-xl font-ethiopic">
                    የመላኪያ መረጃ
                  </CardTitle>
                  <CardDescription>Enter your shipping details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-medium"
                      >
                        First Name
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          id="firstName"
                          value={address.firstName}
                          onChange={(e) =>
                            handleAddressChange("firstName", e.target.value)
                          }
                          className="pl-10 focus-ring rounded-lg h-12"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          id="lastName"
                          value={address.lastName}
                          onChange={(e) =>
                            handleAddressChange("lastName", e.target.value)
                          }
                          className="pl-10 focus-ring rounded-lg h-12"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        value={address.email}
                        onChange={(e) =>
                          handleAddressChange("email", e.target.value)
                        }
                        className="pl-10 focus-ring rounded-lg h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </Label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="phone"
                        type="tel"
                        value={address.phone}
                        onChange={(e) =>
                          handleAddressChange("phone", e.target.value)
                        }
                        placeholder="+251-XXX-XXXXXX"
                        className="pl-10 focus-ring rounded-lg h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address1" className="text-sm font-medium">
                      Address Line 1
                    </Label>
                    <Input
                      id="address1"
                      value={address.address1}
                      onChange={(e) =>
                        handleAddressChange("address1", e.target.value)
                      }
                      className="focus-ring rounded-lg h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address2" className="text-sm font-medium">
                      Address Line 2 (Optional)
                    </Label>
                    <Input
                      id="address2"
                      value={address.address2}
                      onChange={(e) =>
                        handleAddressChange("address2", e.target.value)
                      }
                      className="focus-ring rounded-lg h-12"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium">
                        City
                      </Label>
                      <Input
                        id="city"
                        value={address.city}
                        onChange={(e) =>
                          handleAddressChange("city", e.target.value)
                        }
                        className="focus-ring rounded-lg h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="region" className="text-sm font-medium">
                        Region
                      </Label>
                      <Input
                        id="region"
                        value={address.region}
                        onChange={(e) =>
                          handleAddressChange("region", e.target.value)
                        }
                        className="focus-ring rounded-lg h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode" className="text-sm font-medium">
                      Postal Code (Optional)
                    </Label>
                    <Input
                      id="postalCode"
                      value={address.postalCode}
                      onChange={(e) =>
                        handleAddressChange("postalCode", e.target.value)
                      }
                      className="focus-ring rounded-lg h-12"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="backdrop-blur-ethiopian bg-background/95 shadow-2xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-primary" />
                    Payment Method
                  </CardTitle>
                  <CardTitle className="text-xl font-ethiopic">
                    የመክፈያ ዘዴ
                  </CardTitle>
                  <CardDescription>
                    Choose your preferred payment method
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <motion.div
                      className={`p-6 border rounded-xl cursor-pointer transition-all duration-300 ${
                        paymentMethod === "chapa"
                          ? "border-primary bg-primary/5 shadow-lg"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handlePaymentMethodChange("chapa")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                          <Smartphone className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            Chapa Payment
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Pay with mobile money, bank transfer, or card (ETB)
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-600"
                          >
                            ETB
                          </Badge>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className={`p-6 border rounded-xl cursor-pointer transition-all duration-300 ${
                        paymentMethod === "stripe"
                          ? "border-primary bg-primary/5 shadow-lg"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handlePaymentMethodChange("stripe")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            Stripe Payment
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Pay with international cards (USD)
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant="outline"
                            className="text-blue-600 border-blue-600"
                          >
                            USD
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              className="space-y-6"
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
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Cart Items */}
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <motion.div
                        key={`${item.productId}-${item.variantId}`}
                        className="flex gap-4 p-4 bg-muted/30 rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          {item.nameAm && (
                            <p className="text-sm text-muted-foreground font-ethiopic">
                              {item.nameAm}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">
                            {formatPrice(item.price * item.quantity, currency)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
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
                      <span>Tax (15%)</span>
                      <span className="font-semibold">
                        {formatPrice(getTotalPrice() * 0.15, currency)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-primary">
                        {formatPrice(getTotalPrice() * 1.15, currency)}
                      </span>
                    </div>
                  </div>

                  {/* Security Features */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Shield className="h-5 w-5 text-primary" />
                      <span>Secure payment processing</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Truck className="h-5 w-5 text-primary" />
                      <span>
                        Free shipping on orders over{" "}
                        {formatPrice(1000, currency)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>30-day return policy</span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <AnimatedButton
                    type="submit"
                    className="w-full h-14 text-lg font-medium"
                    disabled={isProcessing}
                    loading={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Place Order - ${formatPrice(
                        getTotalPrice() * 1.15,
                        currency
                      )}`
                    )}
                  </AnimatedButton>
                </CardContent>
              </Card>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  );
}
