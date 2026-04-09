"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { formatPrice, formatDate } from "@/lib/utils";
import type { IOrder, IProduct } from "@/types";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/products?limit=100"),
        ]);
        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();

        if (ordersData.success) setOrders(ordersData.data);
        if (productsData.success) setProducts(productsData.data.items);
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  const statusVariant: Record<string, "default" | "success" | "error" | "warning" | "info"> = {
    pending: "warning",
    processing: "info",
    shipped: "info",
    delivered: "success",
    cancelled: "error",
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-skeleton rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            Manage Products
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-surface-100 dark:bg-surface-800 text-sm font-semibold rounded-xl hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 stagger-children">
        {[
          { label: "Total Revenue", value: formatPrice(totalRevenue), icon: "💰", color: "from-green-500 to-emerald-600" },
          { label: "Total Orders", value: totalOrders.toString(), icon: "📦", color: "from-blue-500 to-indigo-600" },
          { label: "Total Products", value: totalProducts.toString(), icon: "🏷️", color: "from-purple-500 to-violet-600" },
          { label: "Pending Orders", value: pendingOrders.toString(), icon: "⏳", color: "from-amber-500 to-orange-600" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-card animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-[var(--muted)] font-medium">{stat.label}</p>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--divider)]">
          <h2 className="text-lg font-bold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 dark:bg-surface-800">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-[var(--muted)]">Order ID</th>
                <th className="text-left px-6 py-3 font-medium text-[var(--muted)]">Items</th>
                <th className="text-left px-6 py-3 font-medium text-[var(--muted)]">Total</th>
                <th className="text-left px-6 py-3 font-medium text-[var(--muted)]">Status</th>
                <th className="text-left px-6 py-3 font-medium text-[var(--muted)]">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--divider)]">
              {orders.slice(0, 10).map((order) => (
                <tr key={order._id} className="hover:bg-surface-50/50 dark:hover:bg-surface-800/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">{order.items.length} items</td>
                  <td className="px-6 py-4 font-semibold">{formatPrice(order.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={statusVariant[order.status]} size="sm" dot>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-[var(--muted)]">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
