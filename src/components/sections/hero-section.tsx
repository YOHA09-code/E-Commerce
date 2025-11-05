"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ArrowRight, Star, Users, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface HeroSectionProps {
  title: string;
  titleAm?: string;
  subtitle: string;
  subtitleAm?: string;
  ctaText: string;
  ctaTextAm?: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaTextAm?: string;
  secondaryCtaLink?: string;
  backgroundImage?: string;
  showStats?: boolean;
}

export function HeroSection({
  title,
  titleAm,
  subtitle,
  subtitleAm,
  ctaText,
  ctaTextAm,
  ctaLink,
  secondaryCtaText,
  secondaryCtaTextAm,
  secondaryCtaLink,
  backgroundImage,
  showStats = true,
}: HeroSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  const stats = [
    { icon: Users, value: "10K+", label: "Happy Customers" },
    { icon: Star, value: "4.9", label: "Average Rating" },
    { icon: Shield, value: "100%", label: "Secure Payments" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-warm pattern-overlay" />
      {backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt="Hero background"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm font-medium bg-background/80 backdrop-blur-sm border-primary/20"
            >
              🇪🇹 Made for Ethiopia
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-responsive-xl font-bold tracking-tight mb-6 text-gradient-primary"
          >
            {title}
            {titleAm && (
              <span className="block font-ethiopic text-2xl md:text-3xl lg:text-4xl mt-2">
                {titleAm}
              </span>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-responsive-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            {subtitle}
            {subtitleAm && (
              <span className="block font-ethiopic text-lg md:text-xl mt-2">
                {subtitleAm}
              </span>
            )}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <AnimatedButton size="lg" className="w-full sm:w-auto" asChild>
              <Link href={ctaLink}>
                <ShoppingBag className="mr-2 h-5 w-5" />
                {ctaText}
                {ctaTextAm && (
                  <span className="font-ethiopic ml-2">{ctaTextAm}</span>
                )}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </AnimatedButton>

            {secondaryCtaText && secondaryCtaLink && (
              <AnimatedButton
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                asChild
              >
                <Link href={secondaryCtaLink}>
                  {secondaryCtaText}
                  {secondaryCtaTextAm && (
                    <span className="font-ethiopic ml-2">
                      {secondaryCtaTextAm}
                    </span>
                  )}
                </Link>
              </AnimatedButton>
            )}
          </motion.div>

          {/* Stats */}
          {showStats && (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
