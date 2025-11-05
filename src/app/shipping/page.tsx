import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, MapPin, Clock, Shield } from "lucide-react";

export default function ShippingInfoPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-4">Shipping Information</h1>
        <h2 className="text-3xl font-bold font-ethiopic mb-4 text-primary">
          የመላኪያ መረጃ
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <Truck className="h-8 w-8 text-primary mb-4" />
            <CardTitle>Free Shipping</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Free shipping on orders over ETB 1,000</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Clock className="h-8 w-8 text-primary mb-4" />
            <CardTitle>Fast Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <p>2-5 business days for local orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <MapPin className="h-8 w-8 text-primary mb-4" />
            <CardTitle>Track Your Order</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Real-time tracking for all shipments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 text-primary mb-4" />
            <CardTitle>Secure Shipping</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Secure packaging and handling</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
