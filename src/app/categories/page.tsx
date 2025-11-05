import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { motion } from "framer-motion";

const categories = [
  {
    id: "electronics",
    name: "Electronics",
    nameAm: "ኤሌክትሮኒክስ",
    icon: "📱",
    count: 156,
  },
  { id: "fashion", name: "Fashion", nameAm: "ፋሽን", icon: "👗", count: 203 },
  {
    id: "home-garden",
    name: "Home & Garden",
    nameAm: "ቤት እና የገነት",
    icon: "🏠",
    count: 89,
  },
  { id: "sports", name: "Sports", nameAm: "ስፖርት", icon: "⚽", count: 67 },
  { id: "books", name: "Books", nameAm: "መጽሐፍት", icon: "📚", count: 134 },
  { id: "beauty", name: "Beauty", nameAm: "ውበት", icon: "💄", count: 178 },
  { id: "toys", name: "Toys & Games", nameAm: "መጫወቻዎች", icon: "🎮", count: 92 },
  {
    id: "automotive",
    name: "Automotive",
    nameAm: "ሞተር",
    icon: "🚗",
    count: 45,
  },
];

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-4">Product Categories</h1>
        <h2 className="text-3xl font-bold font-ethiopic mb-4 text-primary">
          ምድቦች
        </h2>
        <p className="text-muted-foreground text-lg">
          Browse our wide range of product categories
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Link href={`/products?category=${category.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="text-5xl mb-4">{category.icon}</div>
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                  <p className="text-muted-foreground font-ethiopic">
                    {category.nameAm}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {category.count} products
                  </p>
                  <AnimatedButton
                    variant="ghost"
                    size="sm"
                    className="mt-4 w-full"
                  >
                    Browse →
                  </AnimatedButton>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
