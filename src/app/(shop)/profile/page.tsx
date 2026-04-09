"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";

export default function ProfilePage() {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [isDeactivating, setIsDeactivating] = useState(false);

  if (!session?.user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
        <Link href="/login" className="text-primary-600 font-semibold">
          Go to Login
        </Link>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid gap-6">
        {/* Profile card */}
        <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 sm:p-8 shadow-card">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-[var(--muted)]">{user.email}</p>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <span className="inline-block mt-2 px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-semibold rounded-full uppercase">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(user as any).role || "User"}
              </span>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              ),
              label: "My Orders",
              description: "View and track your orders",
              href: "/orders",
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              ),
              label: "Wishlist",
              description: "Products you've saved",
              href: "/wishlist",
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              ),
              label: "Cart",
              description: "Items in your cart",
              href: "/cart",
            },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
            >
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
                {link.icon}
              </div>
              <p className="font-semibold mb-1">{link.label}</p>
              <p className="text-sm text-[var(--muted)]">{link.description}</p>
            </Link>
          ))}
        </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 pt-8 border-t border-[var(--divider)]">
          <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">
            Danger Zone
          </h3>
          <p className="text-sm text-[var(--muted)] mb-4">
            Once you deactivate your account, you will be logged out. If you wish to reactivate it, you must contact support.
          </p>
          <Button
            variant="danger"
            isLoading={isDeactivating}
            onClick={async () => {
              if (!confirm("Are you absolute sure you want to deactivate your account?")) return;
              setIsDeactivating(true);
              try {
                const res = await fetch("/api/users/deactivate", { method: "PUT" });
                const data = await res.json();
                if (data.success) {
                  addToast("Account deactivated successfully", "info");
                  await signOut({ callbackUrl: "/" });
                } else {
                  addToast(data.error || "Failed to deactivate", "error");
                }
              } catch (error) {
                addToast("An error occurred", "error");
              } finally {
                setIsDeactivating(false);
              }
            }}
          >
            Deactivate Account
          </Button>
        </div>
      </div>
  );
}
