"use client";

import "./globals.css";
import Sidebar from "./components/Sidebar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

function AuthGuard({ children }: any) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // pages that need login
  const protectedPages = [
    "/profile",
    "/my-details",
    "/save",
    "/saved-partners",
  ];

  useEffect(() => {
    if (loading) return;

    // allow login page
    if (pathname === "/login") return;

    // allow home page + public pages
    if (!protectedPages.some((page) => pathname.startsWith(page))) return;

    // allow guest except protected pages
    const guest = localStorage.getItem("guest") === "true";
    if (guest && !protectedPages.some((p) => pathname.startsWith(p))) return;

    // if trying to open protected page
    if (!user) {
      router.push("/login");
    }
  }, [user, loading, pathname]);

  return children;
}

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <AuthProvider>
          {/* Global Sidebar */}
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
