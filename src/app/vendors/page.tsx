import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const vendors = [
  {
    id: "ethiopia-coffee",
    name: "Ethiopia Coffee Co.",
    rating: 4.8,
    products: 124,
    verified: true,
  },
  {
    id: "habesha-fashion",
    name: "Habesha Fashion",
    rating: 4.6,
    products: 89,
    verified: true,
  },
  {
    id: "tech-hub",
    name: "Tech Hub Ethiopia",
    rating: 4.9,
    products: 256,
    verified: true,
  },
  {
    id: "natural-products",
    name: "Natural Products Co.",
    rating: 4.7,
    products: 67,
    verified: false,
  },
];

export default function VendorsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-4">Our Vendors</h1>
        <h2 className="text-3xl font-bold font-ethiopic mb-4 text-primary">
          ሻጭዎቻችን
        </h2>
        <p className="text-muted-foreground text-lg">
          Shop from trusted Ethiopian vendors
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor, index) => (
          <motion.div
            key={vendor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Link href={`/vendors/${vendor.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle>{vendor.name}</CardTitle>
                    {vendor.verified && (
                      <Badge className="bg-green-500 text-white">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">★ {vendor.rating}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {vendor.products} products available
                  </p>
                  <Link href={`/vendors/${vendor.id}`}>
                    <button className="text-primary hover:underline font-medium">
                      Visit Shop →
                    </button>
                  </Link>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
