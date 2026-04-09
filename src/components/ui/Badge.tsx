"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "error" | "warning" | "info";
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<string, string> = {
  default:
    "bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300",
  success:
    "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  error:
    "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  warning:
    "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  info:
    "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

const dotColors: Record<string, string> = {
  default: "bg-surface-400",
  success: "bg-green-500",
  error: "bg-red-500",
  warning: "bg-amber-500",
  info: "bg-blue-500",
};

export default function Badge({
  children,
  variant = "default",
  size = "sm",
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap",
        size === "sm" && "px-2.5 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm",
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full", dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
}
