"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { formatPrice } from "@/lib/utils";
import type { IProduct } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<IProduct | null>(null);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  const [form, setForm] = useState({
    title: "", description: "", price: "", compareAtPrice: "",
    category: "", imageURL: "", stock: "", featured: false,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products?limit=100");
      const data = await res.json();
      if (data.success) setProducts(data.data.items);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }

  const openCreate = () => {
    setEditProduct(null);
    setForm({ title: "", description: "", price: "", compareAtPrice: "", category: "", imageURL: "", stock: "", featured: false });
    setModalOpen(true);
  };

  const openEdit = (p: IProduct) => {
    setEditProduct(p);
    setForm({
      title: p.title,
      description: p.description,
      price: p.price.toString(),
      compareAtPrice: p.compareAtPrice?.toString() || "",
      category: p.category,
      imageURL: p.imageURL,
      stock: p.stock.toString(),
      featured: p.featured,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const body = {
      ...form,
      price: parseFloat(form.price),
      compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : undefined,
      stock: parseInt(form.stock),
    };

    try {
      const url = editProduct ? `/api/products/${editProduct._id}` : "/api/products";
      const method = editProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success) {
        addToast(editProduct ? "Product updated" : "Product created", "success");
        setModalOpen(false);
        fetchProducts();
      } else {
        addToast(data.error || "Failed to save", "error");
      }
    } catch {
      addToast("Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        addToast("Product deleted", "success");
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch {
      addToast("Failed to delete product", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Button onClick={openCreate}>+ Add Product</Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 animate-skeleton rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 dark:bg-surface-800">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-[var(--muted)]">Product</th>
                  <th className="text-left px-6 py-3 font-medium text-[var(--muted)]">Category</th>
                  <th className="text-left px-6 py-3 font-medium text-[var(--muted)]">Price</th>
                  <th className="text-left px-6 py-3 font-medium text-[var(--muted)]">Stock</th>
                  <th className="text-left px-6 py-3 font-medium text-[var(--muted)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--divider)]">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-surface-50/50 dark:hover:bg-surface-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-surface-100 dark:bg-surface-800 shrink-0">
                          <Image src={product.imageURL} alt={product.title} fill className="object-cover" sizes="40px" />
                        </div>
                        <span className="font-medium truncate max-w-[200px]">{product.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)]">{product.category}</td>
                    <td className="px-6 py-4 font-semibold">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4">
                      <span className={product.stock > 0 ? "text-success-600" : "text-error-500"}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(product)} className="px-3 py-1.5 text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors cursor-pointer">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="px-3 py-1.5 text-xs font-medium bg-red-50 dark:bg-red-900/20 text-error-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editProduct ? "Edit Product" : "Add Product"} size="lg">
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <Input label="Compare At Price" type="number" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
            <Input label="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
          </div>
          <Input label="Image URL" value={form.imageURL} onChange={(e) => setForm({ ...form, imageURL: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border px-4 py-2.5 text-sm bg-[var(--input-bg)] border-[var(--input-border)] focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none h-24"
              required
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4 rounded border-[var(--input-border)] accent-primary-600"
            />
            <span className="text-sm font-medium">Featured Product</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} isLoading={saving} className="flex-1">
              {editProduct ? "Update Product" : "Create Product"}
            </Button>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
