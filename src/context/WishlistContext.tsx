"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface WishlistContextValue {
  items: string[]; // product IDs
  isLoading: boolean;
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined
);

const WISHLIST_STORAGE_KEY = "luxemart-wishlist";

export function WishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setIsLoading(false);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoading]);

  const toggleItem = useCallback((productId: string) => {
    setItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => items.includes(productId),
    [items]
  );

  const clearWishlist = useCallback(() => setItems([]), []);

  return (
    <WishlistContext.Provider
      value={{
        items,
        isLoading,
        toggleItem,
        isInWishlist,
        clearWishlist,
        itemCount: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) {
    return { items: [], isLoading: false, toggleItem: () => {}, clearWishlist: () => {}, isInWishlist: () => false, itemCount: 0 };
  }
  return context;
}
