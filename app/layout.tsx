"use client";

import "./globals.css";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

function AuthGuard({ children }: any) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const protectedPages = [
    "/profile",
    "/my-details",
    "/dashboard",
    "/save",
  ];

  useEffect(() => {
    if (loading) return;

    const guest = localStorage.getItem("guest") === "true";

    // Public pages → allow
    if (
      pathname === "/" ||
      pathname === "/login" ||
      pathname.startsWith("/help") ||
      pathname.startsWith("/ai") ||
      pathname.startsWith("/categories")
    ) {
      return;
    }

    // If the page is NOT in protected list → allow
    if (!protectedPages.some((p) => pathname.startsWith(p))) return;

    // Guest is NOT allowed on protected pages
    if (guest) {
      router.push("/login");
      return;
    }

    // If not logged in → redirect
    if (!user) {
      router.push("/login");
    }
  }, [user, loading, pathname, router]);

  return children;
}

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body className="bg-black text-white">

        <AuthProvider>

          {/* Top Navigation */}
          <Navbar />

          {/* Floating Quick Menu (Home, Categories, MyMatches, Profile) */}

          {/* Right-side Sidebar (hamburger menu) */}
          <Sidebar />

          {/* Page Content */}
          <div className="pt-0">
            <AuthGuard>{children}</AuthGuard>
          </div>

        </AuthProvider>

      </body>
    </html>
  );
}
