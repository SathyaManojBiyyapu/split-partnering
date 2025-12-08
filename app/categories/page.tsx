"use client";

import Link from "next/link";

const categories = [
  { slug: "gym", name: "Gym 🏋️" },
  { slug: "fashion", name: "Fashion 👗" },
  { slug: "movies", name: "Movies 🎬" },
  { slug: "lenskart", name: "Lenskart 👓" },
  { slug: "local-travel", name: "Local Travel 🚗" },
  { slug: "events", name: "Events 🎤" },
  { slug: "coupons", name: "Coupons 🎟️" },
  { slug: "villas", name: "Villas 🏡" },
  { slug: "books", name: "Books 📚" },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen pt-28 px-6 text-white">
      <h1 className="text-3xl font-bold text-[#16FF6E] mb-6">Browse Categories 🚀</h1>

      <div className="grid gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/options/${cat.slug}`}
            className="p-5 rounded-xl border border-[#16FF6E]/40 bg-black/40 hover:bg-black/70 transition"
          >
            <h2 className="text-2xl">{cat.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
