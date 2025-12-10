"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingMenu() {
  const pathname = usePathname();

  const menu = [
    { href: "/", label: "🏠", title: "Home" },
    { href: "/categories", label: "📂", title: "Categories" },
    { href: "/dashboard", label: "🤝", title: "My Matches" },
    { href: "/profile", label: "👤", title: "My Info" },
  ];

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-3">
      {menu.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.title}
            className={`
              w-10 h-10 flex items-center justify-center rounded-full text-xl
              transition shadow-lg border backdrop-blur
              ${active
                ? "bg-[#16FF6E] text-black border-[#16FF6E]"
                : "bg-black/60 text-white border-white/20 hover:bg-white/10"}
            `}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
