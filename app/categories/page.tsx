"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const categories = [
  { key: "lenskart", label: "Lenskart", description: "Eye-wear BOGO & frame splits." },
  { key: "fashion", label: "Fashion", description: "Streetwear, fits & seasonal drops." },
  { key: "movies", label: "Movies", description: "OTT + cinema tickets sharing." },
  { key: "gym", label: "Gym & Fitness", description: "Passes, PT & supplement deals." },
  { key: "travel", label: "Travel", description: "Flights, hotels & holiday splits." },
  { key: "events", label: "Events / Flash", description: "Concerts & flash drops." },
];

export default function CategoriesPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user]);

  if (!user) {
    return <p className="p-5 text-white">Checking login...</p>;
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 text-white">
      <h1 className="mb-3 text-3xl font-bold text-[#16FF6E]">
        Choose a category 🔍
      </h1>

      <p className="mb-10 max-w-xl text-center text-sm text-gray-300">
        Browse live offers in each bucket. Swipe to request a partner.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.key}
            href={`/offers/${cat.key}`}
            className="group rounded-2xl border border-[#16FF6E]/20 bg-black/80 p-5 hover:border-[#16FF6E]"
          >
            <h2 className="text-xl font-semibold group-hover:text-[#16FF6E]">
              {cat.label}
            </h2>
            <p className="mt-1 text-xs text-gray-300">{cat.description}</p>
            <span className="mt-3 inline-block text-[#16FF6E] text-xs">
              View offers →
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
