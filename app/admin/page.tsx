"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const mockCategories = [
  { name: "Lenskart", pricePerSwipe: 10, freeSwipes: 5 },
  { name: "Fashion", pricePerSwipe: 15, freeSwipes: 5 },
  { name: "Movies", pricePerSwipe: 10, freeSwipes: 5 },
];

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user]);

  if (!user) {
    return <p className="p-5 text-white">Checking login...</p>;
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-white">
      <h1 className="mb-2 text-3xl font-bold text-[#16FF6E]">
        Admin Control Panel 🛠
      </h1>

      <p className="mb-8 text-sm text-gray-300">
        Visual shell only right now. Later you'll connect it with real APIs.
      </p>

      <section className="mb-8 rounded-2xl border border-[#16FF6E]/30 bg-black/80 p-5">
        <h2 className="mb-3 text-sm font-semibold text-white">
          Category Pricing
        </h2>

        <div className="space-y-3 text-xs">
          {mockCategories.map((cat) => (
            <div
              key={cat.name}
              className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2"
            >
              <span>{cat.name}</span>
              <span>₹{cat.pricePerSwipe} / swipe</span>
              <span>Free: {cat.freeSwipes}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
