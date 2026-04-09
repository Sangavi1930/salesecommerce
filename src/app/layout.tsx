import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "LuxeMart — Premium Shopping Experience",
    template: "%s | LuxeMart",
  },
  description:
    "Discover curated collections of premium products. From electronics to lifestyle, find quality items that elevate your everyday.",
  keywords: ["ecommerce", "shopping", "premium", "electronics", "clothing", "home"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <SessionProvider>
          <ThemeProvider>
            <CartProvider>
              <WishlistProvider>
                <ToastProvider>{children}</ToastProvider>
              </WishlistProvider>
            </CartProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
