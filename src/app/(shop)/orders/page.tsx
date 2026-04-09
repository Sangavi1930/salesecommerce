"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { formatPrice, formatDate } from "@/lib/utils";
import type { IOrder } from "@/types";

const statusVariant: Record<string, "default" | "success" | "error" | "warning" | "info"> = {
  pending: "warning",
  processing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-skeleton rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-24 h-24 bg-surface-100 dark:bg-surface-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-3">No orders yet</h2>
        <p className="text-[var(--muted)] mb-8">When you place an order, it will appear here.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-4 stagger-children">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 hover:shadow-card transition-shadow animate-fade-in"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-xs text-[var(--muted)] mb-1">
                  Order #{order._id.slice(-8).toUpperCase()}
                </p>
                <p className="text-sm text-[var(--muted)]">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={statusVariant[order.status] || "default"} dot>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
                <span className="text-lg font-bold">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 bg-surface-50 dark:bg-surface-800 rounded-lg text-xs"
                >
                  <span className="font-medium">{item.title}</span>
                  <span className="text-[var(--muted)]">×{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
