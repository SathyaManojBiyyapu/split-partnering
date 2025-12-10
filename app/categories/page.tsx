"use client";

const categories = [
  { name: "Gym", slug: "gym", emoji: "🏋️" },
  { name: "Fashion", slug: "fashion", emoji: "👗" },
  { name: "Movies", slug: "movies", emoji: "🎬" },
  { name: "Lenskart", slug: "lenskart", emoji: "👓" },
  { name: "Local Travel", slug: "local-travel", emoji: "🚗" },
  { name: "Events", slug: "events", emoji: "🎤" },
  { name: "Coupons", slug: "coupons", emoji: "🎟️" },
  { name: "Villas", slug: "villas", emoji: "🏡" },
  { name: "Books", slug: "books", emoji: "📚" },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen pt-32 text-white px-6 text-center">
      <h1 className="text-3xl font-bold mb-8 text-[#16FF6E]">Choose a Category</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {categories.map((cat) => (
          <a
            key={cat.slug}
            href={`/options/${cat.slug}`}
            className="p-6 rounded-xl border border-[#16FF6E]/40 bg-black/40 hover:bg-black/70 transition shadow"
          >
            <div className="text-4xl">{cat.emoji}</div>
            <h2 className="mt-3 text-xl">{cat.name}</h2>
          </a>
        ))}
      </div>
    </div>
  );
}
