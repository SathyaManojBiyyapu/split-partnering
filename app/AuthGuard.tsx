"use client";

import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: any) {
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

    if (!protectedPages.some((p) => pathname.startsWith(p))) return;

    if (guest) {
      router.push("/login");
      return;
    }

    if (!user) {
      router.push("/login");
    }
  }, [user, loading, pathname, router]);

  return children;
}