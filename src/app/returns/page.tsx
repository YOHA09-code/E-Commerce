import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Package, Clock, Shield } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-4">Returns & Refunds</h1>
        <h2 className="text-3xl font-bold font-ethiopic mb-4 text-primary">
          መመለሻ እና የገንዘብ መመለሻ
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <RefreshCw className="h-8 w-8 text-primary mb-4" />
            <CardTitle>30-Day Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Return items within 30 days of purchase</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Package className="h-8 w-8 text-primary mb-4" />
            <CardTitle>Easy Process</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Simple return process with prepaid labels</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Clock className="h-8 w-8 text-primary mb-4" />
            <CardTitle>Quick Refunds</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Refunds processed within 5-7 business days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 text-primary mb-4" />
            <CardTitle>Condition Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Items must be unused and in original packaging</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
