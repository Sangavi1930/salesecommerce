import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Shop: [
      { label: "All Products", href: "/products" },
      { label: "Electronics", href: "/products?category=Electronics" },
      { label: "Clothing", href: "/products?category=Clothing" },
      { label: "Home & Living", href: "/products?category=Home" },
      { label: "Sports", href: "/products?category=Sports" },
    ],
    Account: [
      { label: "My Profile", href: "/profile" },
      { label: "My Orders", href: "/orders" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Cart", href: "/cart" },
    ],
    Support: [
      { label: "Help Center", href: "#" },
      { label: "Shipping Info", href: "#" },
      { label: "Returns", href: "#" },
      { label: "Contact Us", href: "#" },
    ],
  };

  return (
    <footer className="border-t border-[var(--divider)] bg-[var(--card-bg)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-xl font-bold">
                <span className="gradient-text">Luxe</span>
                <span>Mart</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--muted)] max-w-xs leading-relaxed mb-6">
              Your premium destination for quality products. Discover curated collections that elevate your everyday life.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {["twitter", "instagram", "github"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-400/10 dark:hover:text-primary-400 transition-colors"
                  aria-label={social}
                >
                  {social === "twitter" && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  )}
                  {social === "instagram" && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" strokeWidth="2"/>
                      <circle cx="12" cy="12" r="5" strokeWidth="2"/>
                      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
                    </svg>
                  )}
                  {social === "github" && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-[var(--divider)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--muted)]">
            © {currentYear} LuxeMart. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Terms</a>
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
