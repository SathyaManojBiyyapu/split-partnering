"use client";

import "./globals.css";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import { Inter, Playfair_Display } from "next/font/google";

/* =========================
   FONTS (INVESTOR GRADE)
========================= */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

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
      pathname.startsWith("/categories") ||
      pathname.startsWith("/investors") ||
      pathname.startsWith("/team") ||
      pathname.startsWith("/contact")
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
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
    >
      <body className="bg-dark-section text-white font-body">

        <AuthProvider>

          {/* Top Navigation */}
          <Navbar />

          {/* Right-side Sidebar (Mobile) */}
          <Sidebar />

          {/* Page Content */}
          <main className="pt-0">
            <AuthGuard>{children}</AuthGuard>
          </main>

          {/* Global Footer */}
          <Footer />

        </AuthProvider>

      </body>
    </html>
  );
}
