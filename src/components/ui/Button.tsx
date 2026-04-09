"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const variantStyles: Record<string, string> = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow-md",
  secondary:
    "bg-surface-100 text-surface-900 hover:bg-surface-200 active:bg-surface-300 dark:bg-surface-800 dark:text-surface-100 dark:hover:bg-surface-700",
  outline:
    "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 active:bg-primary-100 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-400/10",
  ghost:
    "text-surface-600 hover:bg-surface-100 active:bg-surface-200 dark:text-surface-400 dark:hover:bg-surface-800",
  danger:
    "bg-error-500 text-white hover:bg-error-600 active:bg-red-700 shadow-sm",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-7 py-3.5 text-base gap-2.5",
};

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  iconPosition = "left",
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {!isLoading && icon && iconPosition === "left" && (
        <span className="shrink-0">{icon}</span>
      )}
      {children}
      {!isLoading && icon && iconPosition === "right" && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  );
}
