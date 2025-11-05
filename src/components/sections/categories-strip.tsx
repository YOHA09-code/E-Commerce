"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Laptop,
  Shirt,
  Home,
  Dumbbell,
  Heart,
  BookOpen,
  Car,
  Baby,
  Gamepad2,
  Camera,
  Music,
  Wrench,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  nameAm: string;
  icon: React.ComponentType<{ className?: string }>;
  slug: string;
}

const categories: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    nameAm: "ኤሌክትሮኒክስ",
    icon: Laptop,
    slug: "electronics",
  },
  {
    id: "fashion",
    name: "Fashion",
    nameAm: "ፋሽን",
    icon: Shirt,
    slug: "fashion",
  },
  {
    id: "home",
    name: "Home & Garden",
    nameAm: "ቤት እና የገነት",
    icon: Home,
    slug: "home-garden",
  },
  {
    id: "sports",
    name: "Sports",
    nameAm: "ስፖርት",
    icon: Dumbbell,
    slug: "sports",
  },
  {
    id: "beauty",
    name: "Beauty",
    nameAm: "ውበት",
    icon: Heart,
    slug: "beauty",
  },
  {
    id: "books",
    name: "Books",
    nameAm: "መጽሐፍት",
    icon: BookOpen,
    slug: "books",
  },
  {
    id: "automotive",
    name: "Auto",
    nameAm: "አውቶ",
    icon: Car,
    slug: "automotive",
  },
  {
    id: "toys",
    name: "Toys & Games",
    nameAm: "ጨዋታዎች",
    icon: Gamepad2,
    slug: "toys-games",
  },
  {
    id: "camera",
    name: "Cameras",
    nameAm: "ካሜራዎች",
    icon: Camera,
    slug: "cameras",
  },
  {
    id: "music",
    name: "Musical",
    nameAm: "ሙዚቃዊ",
    icon: Music,
    slug: "musical",
  },
  {
    id: "tools",
    name: "Tools",
    nameAm: "መሳሪያዎች",
    icon: Wrench,
    slug: "tools",
  },
];

export function CategoriesStrip() {
  return (
    <section className="py-6 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="flex-shrink-0"
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className="flex flex-col items-center gap-2 min-w-[80px] md:min-w-[100px] group"
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                    <Icon className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs md:text-sm font-medium group-hover:text-primary transition-colors">
                      {category.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-ethiopic">
                      {category.nameAm}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


