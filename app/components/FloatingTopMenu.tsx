"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingMenu() {
  const pathname = usePathname();

  const menu = [
    { href: "/", label: "Home" },
    { href: "/categories", label: "Categories" },
    { href: "/dashboard", label: "My Matches" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-4">
      {menu.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition
              ${active
                ? "bg-[#16FF6E] text-black shadow-[0_0_10px_#16FF6E]"
                : "bg-black/60 text-white border border-white/20 hover:bg-white/10"
              }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
