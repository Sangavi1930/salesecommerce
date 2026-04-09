"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import type { ICartItem } from "@/types";

/* ── State ── */
interface CartState {
  items: ICartItem[];
  isLoading: boolean;
}

/* ── Actions ── */
type CartAction =
  | { type: "SET_CART"; payload: ICartItem[] }
  | { type: "ADD_ITEM"; payload: ICartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_LOADING"; payload: boolean };

/* ── Context value ── */
interface CartContextValue extends CartState {
  addItem: (item: ICartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

/* ── Reducer ── */
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_CART":
      return { ...state, items: action.payload, isLoading: false };
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.productId === action.payload.productId
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === action.payload.productId
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.productId !== action.payload),
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.payload.productId
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

const CART_STORAGE_KEY = "luxemart-cart";

/* ── Provider ── */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isLoading: true,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        dispatch({ type: "SET_CART", payload: JSON.parse(stored) });
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } catch {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    }
  }, [state.items, state.isLoading]);

  const addItem = useCallback((item: ICartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  }, []);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 1) {
        dispatch({ type: "REMOVE_ITEM", payload: productId });
      } else {
        dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
      }
    },
    []
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    return { 
      items: [], isLoading: false, addItem: () => {}, removeItem: () => {}, 
      updateQuantity: () => {}, clearCart: () => {}, totalItems: 0, totalPrice: 0 
    };
  }
  return context;
}
