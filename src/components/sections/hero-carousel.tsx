"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import Link from "next/link";
import Image from "next/image";

interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  titleAm?: string;
  subtitle: string;
  subtitleAm?: string;
  ctaText: string;
  ctaLink: string;
}

interface HeroCarouselProps {
  slides?: CarouselSlide[];
  autoplayInterval?: number;
}

const defaultSlides: CarouselSlide[] = [
  {
    id: "1",
    image: "https://via.placeholder.com/1200/400",
    title: "Flash Sale - Up to 70% Off",
    titleAm: "ፍላሽ ሽያጭ - እስከ 70% ቅናሽ",
    subtitle: "Discover amazing deals on thousands of products",
    subtitleAm: "በሺዎች የሚቆጠሩ ምርቶች ላይ አስደናቂ ቅናሾችን ያግኙ",
    ctaText: "Shop Now",
    ctaLink: "/products?filter=sale",
  },
  {
    id: "2",
    image: "https://via.placeholder.com/1200/400",
    title: "New Arrivals",
    titleAm: "አዲስ መምጣት",
    subtitle: "Latest products from trusted vendors",
    subtitleAm: "ከአስተማማኝ ሻጭዎች የቅርብ ጊዜ ምርቶች",
    ctaText: "Explore",
    ctaLink: "/products?filter=new",
  },
  {
    id: "3",
    image: "https://via.placeholder.com/1200/400",
    title: "Free Shipping on Orders Over ETB 500",
    titleAm: "በ ETB 500 በላይ ትዕዛዞች ላይ ነጻ ማጓጓዣ",
    subtitle: "Shop more, save more on shipping",
    subtitleAm: "ተጨማሪ ይግዙ፣ በማጓጓዣ ላይ ይቆጥቡ",
    ctaText: "Start Shopping",
    ctaLink: "/products",
  },
];

export function HeroCarousel({
  slides = defaultSlides,
  autoplayInterval = 5000,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [isPaused, autoplayInterval, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div
      className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[currentIndex].id}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div className="relative w-full h-full">
            <Image
              src={slides[currentIndex].image}
              alt={slides[currentIndex].title}
              fill
              className="object-cover"
              priority={currentIndex === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 md:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="max-w-2xl text-white"
                >
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">
                    {slides[currentIndex].title}
                  </h2>
                  {slides[currentIndex].titleAm && (
                    <h2 className="text-2xl md:text-4xl font-bold mb-4 font-ethiopic">
                      {slides[currentIndex].titleAm}
                    </h2>
                  )}
                  <p className="text-lg md:text-xl mb-6 opacity-90">
                    {slides[currentIndex].subtitle}
                  </p>
                  {slides[currentIndex].subtitleAm && (
                    <p className="text-base md:text-lg mb-6 opacity-90 font-ethiopic">
                      {slides[currentIndex].subtitleAm}
                    </p>
                  )}
                  <Link href={slides[currentIndex].ctaLink}>
                    <AnimatedButton size="lg" className="bg-primary text-primary-foreground">
                      {slides[currentIndex].ctaText}
                    </AnimatedButton>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 text-gray-900" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 text-gray-900" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-primary w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}


