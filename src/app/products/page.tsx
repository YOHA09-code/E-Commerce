"use client";

import { useState, useEffect } from "react";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Star,
  ShoppingCart,
  Heart,
  Eye,
  Grid3X3,
  List,
  SlidersHorizontal,
  SortAsc,
  SortDesc,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { toast } from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Mock data - in real app, this would come from API
const mockProducts = [
  {
    id: "1",
    name: "Ethiopian Coffee Beans",
    nameAm: "ኢትዮጵያዊ ቡና",
    price: 450,
    originalPrice: 500,
    image: "/api/placeholder/300/300",
    rating: 4.8,
    reviews: 124,
    vendor: "Ethiopian Coffee Co.",
    inStock: true,
    category: "Food & Beverages",
    categoryAm: "ምግብ እና መጠጦች",
    isNew: true,
    isFeatured: true,
  },
  {
    id: "2",
    name: "Traditional Ethiopian Dress",
    nameAm: "ባህላዊ ኢትዮጵያዊ ልብስ",
    price: 1200,
    image: "/api/placeholder/300/300",
    rating: 4.6,
    reviews: 89,
    vendor: "Habesha Fashion",
    inStock: true,
    category: "Fashion",
    categoryAm: "ፋሽን",
    isNew: false,
    isFeatured: true,
  },
  {
    id: "3",
    name: "Smartphone - Samsung Galaxy",
    nameAm: "ስማርትፎን - ሳምሰንግ ጋላክሲ",
    price: 15000,
    image: "/api/placeholder/300/300",
    rating: 4.9,
    reviews: 256,
    vendor: "Tech Hub Ethiopia",
    inStock: false,
    category: "Electronics",
    categoryAm: "ኤሌክትሮኒክስ",
    isNew: true,
    isFeatured: false,
  },
  {
    id: "4",
    name: "Ethiopian Honey",
    nameAm: "ኢትዮጵያዊ ማር",
    price: 350,
    image: "/api/placeholder/300/300",
    rating: 4.7,
    reviews: 67,
    vendor: "Natural Products Co.",
    inStock: true,
    category: "Food & Beverages",
    categoryAm: "ምግብ እና መጠጦች",
    isNew: false,
    isFeatured: false,
  },
  {
    id: "5",
    name: "Laptop - HP Pavilion",
    nameAm: "ላፕቶፕ - ኤችፒ ፓቪሊዮን",
    price: 25000,
    image: "/api/placeholder/300/300",
    rating: 4.5,
    reviews: 45,
    vendor: "Computer World",
    inStock: true,
    category: "Electronics",
    categoryAm: "ኤሌክትሮኒክስ",
    isNew: false,
    isFeatured: true,
  },
  {
    id: "6",
    name: "Ethiopian Spices Set",
    nameAm: "ኢትዮጵያዊ ቅመሞች",
    price: 280,
    image: "/api/placeholder/300/300",
    rating: 4.8,
    reviews: 156,
    vendor: "Spice Master",
    inStock: true,
    category: "Food & Beverages",
    categoryAm: "ምግብ እና መጠጦች",
    isNew: true,
    isFeatured: false,
  },
];

const categories = [
  { name: "All", nameAm: "ሁሉም", count: mockProducts.length },
  { name: "Food & Beverages", nameAm: "ምግብ እና መጠጦች", count: 3 },
  { name: "Fashion", nameAm: "ፋሽን", count: 1 },
  { name: "Electronics", nameAm: "ኤሌክትሮኒክስ", count: 2 },
];

const sortOptions = [
  { value: "newest", label: "Newest First", labelAm: "አዲስ በመጀመሪያ" },
  { value: "price-low", label: "Price: Low to High", labelAm: "ዋጋ: ከዝቅ ወደ ከፍ" },
  {
    value: "price-high",
    label: "Price: High to Low",
    labelAm: "ዋጋ: ከከፍ ወደ ዝቅ",
  },
  { value: "rating", label: "Highest Rated", labelAm: "ከፍተኛ ደረጃ" },
  { value: "popular", label: "Most Popular", labelAm: "በጣም ታዋቂ" },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);

  useEffect(() => {
    let filtered = mockProducts;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.nameAm?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.vendor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Sort products
    switch (sortBy) {
      case "newest":
        filtered = filtered.sort(
          (a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
        );
        break;
      case "price-low":
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        filtered = filtered.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, sortBy]);

  // Initialize search from URL (?search=...)
  useEffect(() => {
    const q = searchParams?.get("search") || "";
    setSearchQuery(q);
  }, [searchParams]);

  const ProductCard = ({ product, index }: { product: any; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <AnimatedCard hover={true} className="group h-full">
        <div className="relative">
          <div className="aspect-square relative overflow-hidden rounded-t-lg">
            <Image
              src={product.image}
              alt={`${product.name}${
                product.nameAm ? ` - ${product.nameAm}` : ""
              }`}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.isNew && (
                <Badge className="bg-green-500 text-white text-xs">New</Badge>
              )}
              {product.isFeatured && (
                <Badge className="bg-primary text-primary-foreground text-xs">
                  Featured
                </Badge>
              )}
              {!product.inStock && (
                <Badge variant="destructive" className="text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Action buttons */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <AnimatedButton
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-white/90 hover:bg-white"
              >
                <Heart className="h-4 w-4" />
              </AnimatedButton>
              <Link
                href={`/products/${product.id}`}
                aria-label="View details"
                className="h-8 w-8 bg-white/90 hover:bg-white rounded-md flex items-center justify-center"
              >
                <Eye className="h-4 w-4" />
              </Link>
            </div>

            {/* Out of stock overlay */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-sm">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Category */}
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {product.category}
                </Badge>
                <Badge variant="outline" className="text-xs font-ethiopic">
                  {product.categoryAm}
                </Badge>
              </div>

              {/* Product name */}
              <div>
                <Link
                  href={`/products/${product.id}`}
                  className="font-semibold line-clamp-2 text-lg group-hover:text-primary transition-colors"
                >
                  {product.name}
                </Link>
                <p className="text-sm text-muted-foreground font-ethiopic">
                  {product.nameAm}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium ml-1">
                  {product.rating}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({product.reviews})
                </span>
              </div>

              {/* Vendor */}
              <p className="text-sm text-muted-foreground">
                by {product.vendor}
              </p>

              {/* Price and CTA */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {product.originalPrice && (
                    <div className="text-xs text-green-600 font-medium">
                      Save {formatPrice(product.originalPrice - product.price)}
                    </div>
                  )}
                </div>
                <AnimatedButton
                  size="sm"
                  disabled={!product.inStock}
                  className="shrink-0"
                  onClick={() => {
                    useCartStore.getState().addItem({
                      id: `${product.id}`,
                      productId: `${product.id}`,
                      name: product.name,
                      nameAm: product.nameAm,
                      price: product.price,
                      image: product.image,
                      stock: product.inStock ? 99 : 0,
                    });
                    toast.success("Added to cart");
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add
                </AnimatedButton>
              </div>
            </div>
          </CardContent>
        </div>
      </AnimatedCard>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-primary">
            All Products
          </h1>
          <h1 className="text-2xl md:text-3xl font-bold mb-4 font-ethiopic">
            ሁሉም ምርቶች
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover amazing products from local and international vendors
          </p>
          <p className="text-base text-muted-foreground font-ethiopic">
            ከአካባቢ እና ከዓለም አቀፍ ሻጭዎች አስደናቂ ምርቶችን ያግኙ
          </p>
        </motion.div>

        {/* Search and Controls */}
        <motion.div
          className="flex flex-col lg:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10 focus-ring rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-input rounded-lg bg-background focus-ring text-sm"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Mode */}
            <div className="flex border border-input rounded-lg">
              <AnimatedButton
                variant={viewMode === "grid" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </AnimatedButton>
              <AnimatedButton
                variant={viewMode === "list" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </AnimatedButton>
            </div>

            {/* Filters */}
            <AnimatedButton
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </AnimatedButton>
          </div>
        </motion.div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <motion.div
            className={`hidden lg:block w-64 space-y-6 ${
              showFilters ? "lg:block" : ""
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Categories
                  <span className="text-sm text-muted-foreground">
                    {filteredProducts.length} products
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.name
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {category.count}
                      </span>
                    </div>
                    <div className="text-sm font-ethiopic">
                      {category.nameAm}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sort By</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      sortBy === option.value
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm font-ethiopic">
                      {option.labelAm}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Mobile Filters Overlay */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFilters(false)}
              >
                <motion.div
                  className="absolute right-0 top-0 h-full w-80 bg-background shadow-xl"
                  initial={{ x: 320 }}
                  animate={{ x: 0 }}
                  exit={{ x: 320 }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold">Filters</h2>
                      <AnimatedButton
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowFilters(false)}
                      >
                        <X className="h-4 w-4" />
                      </AnimatedButton>
                    </div>

                    {/* Mobile filter content - same as sidebar */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-3">Categories</h3>
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <button
                              key={category.name}
                              onClick={() => {
                                setSelectedCategory(category.name);
                                setShowFilters(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                selectedCategory === category.name
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-muted"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">
                                  {category.name}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {category.count}
                                </span>
                              </div>
                              <div className="text-sm font-ethiopic">
                                {category.nameAm}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid/List */}
          <div className="flex-1">
            <motion.div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
              }
              layout
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* No results */}
            {filteredProducts.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <AnimatedButton
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                >
                  Clear Filters
                </AnimatedButton>
              </motion.div>
            )}

            {/* Load More */}
            {filteredProducts.length > 0 && (
              <motion.div
                className="text-center mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <AnimatedButton variant="outline" size="lg">
                  Load More Products
                </AnimatedButton>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
