"use client";

import React, { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { formatPrice, formatDate } from "@/lib/utils";
import type { IOrder } from "@/types";

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];
const statusVariant: Record<string, "default" | "success" | "error" | "warning" | "info"> = {
  pending: "warning",
  processing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: status as IOrder["status"] } : o))
        );
        addToast("Order status updated", "success");
      }
    } catch {
      addToast("Failed to update status", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 animate-skeleton rounded-xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
          <p className="text-[var(--muted)]">Orders will appear here when customers place them.</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 dark:bg-surface-800">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-[var(--muted)]">Order ID</th>
                  <th className="text-left px-6 py-3 font-medium text-[var(--muted)]">Items</th>
                  <th className="text-left px-6 py-3 font-medium text-[var(--muted)]">Total</th>
                  <th className="text-left px-6 py-3 font-medium text-[var(--muted)]">Status</th>
                  <th className="text-left px-6 py-3 font-medium text-[var(--muted)]">Date</th>
                  <th className="text-left px-6 py-3 font-medium text-[var(--muted)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--divider)]">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-surface-50/50 dark:hover:bg-surface-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-4">{order.items.length} items</td>
                    <td className="px-6 py-4 font-semibold">{formatPrice(order.totalAmount)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant[order.status]} size="sm" dot>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)]">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="px-2 py-1 rounded-lg text-xs bg-[var(--input-bg)] border border-[var(--input-border)] outline-none cursor-pointer"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
