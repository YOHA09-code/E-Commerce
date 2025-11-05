"use client";

import { motion } from "framer-motion";
import { Button, ButtonProps } from "./button";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends Omit<ButtonProps, "variant" | "size"> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  asChild?: boolean;
}

const buttonVariants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  outline:
    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizeVariants = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 py-2",
  lg: "h-12 px-8 text-lg",
  icon: "h-10 w-10",
};

export function AnimatedButton({
  variant = "primary",
  size = "md",
  children,
  className,
  disabled = false,
  loading = false,
  onClick,
  asChild = false,
  ...props
}: AnimatedButtonProps) {
  const motionProps = {
    whileHover: { scale: disabled ? 1 : 1.02 },
    whileTap: { scale: disabled ? 1 : 0.98 },
    transition: { duration: 0.2 },
  };

  if (asChild) {
    return (
      <motion.div {...motionProps}>
        <Button
          className={cn(
            "relative overflow-hidden",
            buttonVariants[variant],
            sizeVariants[size],
            className
          )}
          disabled={disabled || loading}
          onClick={onClick}
          asChild={asChild}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div {...motionProps}>
      <Button
        className={cn(
          "relative overflow-hidden",
          buttonVariants[variant],
          sizeVariants[size],
          className
        )}
        disabled={disabled || loading}
        onClick={onClick}
        {...props}
      >
        {loading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-background/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="spinner h-4 w-4" />
          </motion.div>
        )}
        <motion.span
          className={cn(
            "flex items-center justify-center",
            loading && "opacity-0"
          )}
          animate={{ opacity: loading ? 0 : 1 }}
        >
          {children}
        </motion.span>
      </Button>
    </motion.div>
  );
}
