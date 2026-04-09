"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular";
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-skeleton",
        variant === "circular" && "rounded-full",
        variant === "text" && "rounded-md h-4",
        variant === "rectangular" && "rounded-xl",
        className
      )}
      style={{ width, height }}
    />
  );
}

/* ── Pre-built skeleton patterns ── */

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)]">
      <Skeleton className="w-full h-64" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" className="w-3/4 h-3" />
        <Skeleton variant="text" className="w-1/2 h-5" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton variant="text" className="w-20 h-4" />
          <Skeleton variant="circular" className="w-10 h-10" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]">
      <Skeleton className="w-24 h-24 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-3/4 h-4" />
        <Skeleton variant="text" className="w-1/4 h-5" />
        <Skeleton variant="text" className="w-1/3 h-8" />
      </div>
    </div>
  );
}
