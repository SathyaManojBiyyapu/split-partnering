"use client";

import "./globals.css";
import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

function AuthGuard({ children }: any) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (pathname === "/login") return;

    if (!user) router.push("/login");
  }, [user, loading, pathname]);

  return children;
}

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <AuthProvider>
          <Navbar />
          <AuthGuard>{children}</AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
