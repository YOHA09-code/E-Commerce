"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  titleAm?: string;
  description: string;
  descriptionAm?: string;
  color?: string;
}

interface FeaturesSectionProps {
  title: string;
  titleAm?: string;
  subtitle: string;
  subtitleAm?: string;
  features: Feature[];
  className?: string;
}

export function FeaturesSection({
  title,
  titleAm,
  subtitle,
  subtitleAm,
  features,
  className,
}: FeaturesSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  return (
    <section
      className={cn("py-24 bg-background/50 backdrop-blur-sm", className)}
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gradient-primary">
            {title}
            {titleAm && (
              <span className="block font-ethiopic text-3xl md:text-4xl lg:text-5xl mt-3 text-primary">
                {titleAm}
              </span>
            )}
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {subtitle}
            {subtitleAm && (
              <span className="block font-ethiopic text-lg md:text-xl mt-3">
                {subtitleAm}
              </span>
            )}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <AnimatedCard
                hover={true}
                delay={index * 0.1}
                className="h-full group border-2 border-transparent hover:border-primary/20 transition-all duration-300"
              >
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto mb-6">
                    <div
                      className={cn(
                        "w-20 h-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300",
                        feature.color ||
                          "bg-primary/10 group-hover:bg-primary/20"
                      )}
                    >
                      <feature.icon
                        className={cn(
                          "h-10 w-10 group-hover:scale-110 transition-transform duration-300",
                          feature.color ? "text-current" : "text-primary"
                        )}
                      />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                    {feature.titleAm && (
                      <span className="block font-ethiopic text-xl mt-2 group-hover:text-primary/80 transition-colors duration-300">
                        {feature.titleAm}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-lg leading-relaxed">
                    {feature.description}
                    {feature.descriptionAm && (
                      <span className="block font-ethiopic text-base mt-3 leading-relaxed">
                        {feature.descriptionAm}
                      </span>
                    )}
                  </CardDescription>
                </CardContent>
              </AnimatedCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
