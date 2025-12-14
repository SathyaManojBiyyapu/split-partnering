"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categories" },
  { href: "/dashboard", label: "My Matches" },
  { href: "/investors", label: "Investors" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [guest, setGuest] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("loggedIn") === "true") setLoggedIn(true);
    if (localStorage.getItem("guest") === "true") setGuest(true);
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-30 border-b border-dark-card bg-black/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-3 sm:px-4 py-2 sm:py-3">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-gold-primary shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
          <span className="font-heading text-base sm:text-lg tracking-wide">
            Partner<span className="text-gold-primary">Sync</span>
          </span>
        </Link>

        {/* LINKS + LOGIN/LOGOUT (DESKTOP ONLY) */}
        <div className="hidden md:flex items-center gap-3 text-sm font-body">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-full transition-all duration-200
                  ${
                    isActive
                      ? "bg-gold-primary text-black shadow-[0_0_15px_rgba(212,175,55,0.9)]"
                      : "text-text-muted hover:text-black hover:bg-gold-primary/90 hover:shadow-[0_0_18px_rgba(212,175,55,0.8)] hover:-translate-y-[1px]"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}

          {!loggedIn && !guest && (
            <Link
              href="/login"
              className="ml-2 rounded-full border border-gold-primary px-3 py-1.5 text-xs font-medium
                         text-gold-primary hover:bg-gold-primary hover:text-black
                         hover:shadow-[0_0_15px_rgba(212,175,55,0.8)]
                         transition"
            >
              Login / OTP
            </Link>
          )}

          {(loggedIn || guest) && (
            <button
              onClick={logout}
              className="ml-2 rounded-full border border-red-500/40 bg-red-600/10
                         px-3 py-1.5 text-xs font-medium text-red-400
                         hover:bg-red-600/20 hover:border-red-500 transition"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
