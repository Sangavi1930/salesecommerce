"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { totalItems } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = () => setUserMenuOpen(false);
    if (userMenuOpen) {
      document.addEventListener("click", handleClick);
    }
    return () => document.removeEventListener("click", handleClick);
  }, [userMenuOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-[var(--header-bg)] backdrop-blur-xl shadow-sm border-b border-[var(--divider)]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-glow transition-shadow duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="gradient-text">Luxe</span>
                <span className="text-[var(--foreground)]">Mart</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-400/10"
                      : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-surface-100 dark:hover:bg-surface-800"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors relative hidden sm:flex"
                aria-label="Wishlist"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-error-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors relative"
                aria-label="Cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>

              {/* User menu */}
              {session ? (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserMenuOpen(!userMenuOpen);
                    }}
                    className="flex items-center gap-2 p-1.5 pl-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                      {session.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="hidden lg:block text-sm font-medium max-w-[100px] truncate">
                      {session.user?.name}
                    </span>
                    <svg className="w-4 h-4 hidden lg:block text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-xl animate-scale-in overflow-hidden">
                      <div className="px-4 py-3 border-b border-[var(--divider)]">
                        <p className="text-sm font-semibold truncate">{session.user?.name}</p>
                        <p className="text-xs text-[var(--muted)] truncate">{session.user?.email}</p>
                      </div>
                      <div className="py-1">
                        <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                          <svg className="w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          My Profile
                        </Link>
                        <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                          <svg className="w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          My Orders
                        </Link>
                        <Link href="/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors sm:hidden">
                          <svg className="w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          Wishlist
                        </Link>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {(session.user as any)?.role === "admin" && (
                          <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                            <svg className="w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Admin Panel
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-[var(--divider)] py-1">
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-4 animate-fade-in">
              <form onSubmit={handleSearch} className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  autoFocus
                />
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-72 bg-[var(--card-bg)] z-50 animate-slide-in-right md:hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-[var(--divider)]">
              <span className="text-lg font-bold gradient-text">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-400/10"
                      : "text-[var(--foreground)] hover:bg-surface-100 dark:hover:bg-surface-800"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/wishlist" className="block px-4 py-3 rounded-xl text-sm font-medium hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>
              <Link href="/cart" className="block px-4 py-3 rounded-xl text-sm font-medium hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                Cart {totalItems > 0 && `(${totalItems})`}
              </Link>
              {!session && (
                <Link
                  href="/login"
                  className="block mt-4 px-4 py-3 bg-primary-600 text-white text-sm font-semibold rounded-xl text-center hover:bg-primary-700 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-18" />
    </>
  );
}
