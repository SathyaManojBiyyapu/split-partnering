"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "./components/Navbar";
import "./globals.css";

export default function RootLayout({ children }: any) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");

    // Allow login page always
    if (pathname === "/login") return;

    // If NOT logged in → redirect to login
    if (!loggedIn) {
      router.push("/login");
    }
  }, [pathname]);

  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
