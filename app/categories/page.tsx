"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const categories = [
  { key: "lenskart", label: "Lenskart", description: "Eye-wear BOGO & frame splits." },
  { key: "fashion", label: "Fashion", description: "Streetwear & seasonal drops." },
  { key: "movies", label: "Movies", description: "OTT + cinema splits." },
  { key: "gym", label: "Gym", description: "Passes & supplements." },
  { key: "travel", label: "Travel", description: "Flights & hotel splits." },
  { key: "events", label: "Events", description: "Concerts & flash deals." },
];

export default function CategoriesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // FIX: Only redirect if Firebase finished checking auth
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // FIX: Do NOT redirect while Firebase is checking authentication
  if (loading) {
    return <p className="p-5 text-white">Checking login...</p>;
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-white">
      <h1 className="text-3xl font-bold text-[#16FF6E] mb-4">Choose a category 🔍</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.key}
            href={`/offers/${cat.key}`}
            className="rounded-2xl border border-[#16FF6E]/30 p-5 bg-black/60 hover:border-[#16FF6E]"
          >
            <h2 className="text-xl font-semibold mb-2">{cat.label}</h2>
            <p className="text-xs text-gray-300">{cat.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
