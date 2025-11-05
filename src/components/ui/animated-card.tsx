"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function AnimatedCard({
  children,
  className,
  hover = true,
  delay = 0,
  direction = "up",
}: AnimatedCardProps) {
  const directionVariants = {
    up: { y: 20, opacity: 0 },
    down: { y: -20, opacity: 0 },
    left: { x: 20, opacity: 0 },
    right: { x: -20, opacity: 0 },
  };

  return (
    <motion.div
      initial={directionVariants[direction]}
      animate={{ y: 0, x: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut",
      }}
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      className={cn("card-hover", className)}
    >
      <Card className="h-full">{children}</Card>
    </motion.div>
  );
}

interface AnimatedCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedCardContent({
  children,
  className,
}: AnimatedCardContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedCardHeader({
  children,
  className,
}: AnimatedCardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
