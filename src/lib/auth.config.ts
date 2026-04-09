import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Edge-compatible auth config (no DB imports).
 * Used by middleware for route protection.
 */
const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // authorize is defined in the full auth.ts, not here
      authorize: () => null,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = (user as any).role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).role = token.role;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedPaths = ["/cart", "/wishlist", "/orders", "/profile"];
      const adminPaths = ["/admin"];
      const isProtected = protectedPaths.some((p) =>
        nextUrl.pathname.startsWith(p)
      );
      const isAdminRoute = adminPaths.some((p) =>
        nextUrl.pathname.startsWith(p)
      );

      if (isAdminRoute) {
        if (!isLoggedIn) return false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const role = (auth as any)?.user?.role;
        if (role !== "admin") {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      if (isProtected) {
        if (!isLoggedIn) return false;
        return true;
      }

      // Redirect logged-in users away from auth pages
      const authPaths = ["/login", "/register"];
      const isAuthPage = authPaths.some((p) =>
        nextUrl.pathname.startsWith(p)
      );
      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
  },
};

export default authConfig;
