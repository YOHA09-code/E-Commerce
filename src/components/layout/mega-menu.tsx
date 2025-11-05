"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Shirt,
  Home,
  Laptop,
  Heart,
  BookOpen,
  Dumbbell,
  Car,
  Baby,
  Gamepad2,
  Camera,
  Music,
  Wrench,
  Sparkles,
  Grid3X3,
} from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";

interface Category {
  id: string;
  name: string;
  nameAm: string;
  icon: React.ComponentType<{ className?: string }>;
  subcategories?: { name: string; nameAm: string; slug: string }[];
}

const categories: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    nameAm: "ኤሌክትሮኒክስ",
    icon: Laptop,
    subcategories: [
      { name: "Smartphones", nameAm: "ስማርትፎኖች", slug: "smartphones" },
      { name: "Laptops", nameAm: "ላፕቶፖች", slug: "laptops" },
      { name: "Tablets", nameAm: "ጡቦች", slug: "tablets" },
      { name: "Audio", nameAm: "ድምፅ", slug: "audio" },
      { name: "Cameras", nameAm: "ካሜራዎች", slug: "cameras" },
    ],
  },
  {
    id: "fashion",
    name: "Fashion",
    nameAm: "ፋሽን",
    icon: Shirt,
    subcategories: [
      { name: "Men's Clothing", nameAm: "የወንዶች ልብስ", slug: "mens-clothing" },
      { name: "Women's Clothing", nameAm: "የሴቶች ልብስ", slug: "womens-clothing" },
      { name: "Accessories", nameAm: "መሳሪያዎች", slug: "accessories" },
      { name: "Shoes", nameAm: "እግር ጫማዎች", slug: "shoes" },
      { name: "Jewelry", nameAm: "የከበደ", slug: "jewelry" },
    ],
  },
  {
    id: "home",
    name: "Home & Garden",
    nameAm: "ቤት እና የገነት",
    icon: Home,
    subcategories: [
      { name: "Furniture", nameAm: "ዕቃዎች", slug: "furniture" },
      { name: "Kitchen", nameAm: "የማዕድ", slug: "kitchen" },
      { name: "Bedding", nameAm: "የመጻለያ", slug: "bedding" },
      { name: "Decor", nameAm: "የውበት", slug: "decor" },
      { name: "Garden Tools", nameAm: "የገነት መሳሪያዎች", slug: "garden-tools" },
    ],
  },
  {
    id: "sports",
    name: "Sports & Outdoors",
    nameAm: "ስፖርት እና ከቤት ውጭ",
    icon: Dumbbell,
    subcategories: [
      { name: "Fitness", nameAm: "አካል ብቃት", slug: "fitness" },
      { name: "Outdoor", nameAm: "ከቤት ውጭ", slug: "outdoor" },
      { name: "Sports Gear", nameAm: "የስፖርት መሳሪያዎች", slug: "sports-gear" },
      { name: "Team Sports", nameAm: "የቡድን ስፖርት", slug: "team-sports" },
    ],
  },
  {
    id: "beauty",
    name: "Beauty & Personal Care",
    nameAm: "ውበት እና የግላዊ እንክብካቤ",
    icon: Heart,
    subcategories: [
      { name: "Skincare", nameAm: "የቆዳ እንክብካቤ", slug: "skincare" },
      { name: "Makeup", nameAm: "የግርጌ ክዋኔ", slug: "makeup" },
      { name: "Hair Care", nameAm: "የጸጉር እንክብካቤ", slug: "hair-care" },
      { name: "Fragrances", nameAm: "የሽታ", slug: "fragrances" },
    ],
  },
  {
    id: "books",
    name: "Books & Media",
    nameAm: "መጽሐፍት እና ሚዲያ",
    icon: BookOpen,
    subcategories: [
      { name: "Books", nameAm: "መጽሐፍት", slug: "books" },
      { name: "E-books", nameAm: "ኢ-መጽሐፍት", slug: "ebooks" },
      { name: "Audiobooks", nameAm: "የድምፅ መጽሐፍት", slug: "audiobooks" },
    ],
  },
];

interface MegaMenuProps {
  onClose?: () => void;
}

export function MegaMenu({ onClose }: MegaMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveCategory(null);
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute top-full left-0 w-full bg-background border-b shadow-lg z-50"
      onMouseLeave={() => setActiveCategory(null)}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-6 gap-8">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => setActiveCategory(category.id)}
              >
                <Link
                  href={`/categories/${category.id}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted/50 transition-colors group"
                  onClick={onClose}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground font-ethiopic">
                      {category.nameAm}
                    </p>
                  </div>
                </Link>

                <AnimatePresence>
                  {isActive && category.subcategories && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-background border rounded-lg shadow-xl p-4 z-10"
                    >
                      <div className="space-y-2">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/categories/${category.id}/${sub.slug}`}
                            className="block px-3 py-2 rounded-md hover:bg-muted transition-colors"
                            onClick={onClose}
                          >
                            <p className="text-sm font-medium">{sub.name}</p>
                            <p className="text-xs text-muted-foreground font-ethiopic">
                              {sub.nameAm}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


