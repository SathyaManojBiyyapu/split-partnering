"use client";

export default function CategoriesPage() {
  const categories = [
    { name: "Fashion", icon: "👗", slug: "fashion" },
    { name: "Food", icon: "🍔", slug: "food" },
    { name: "Travel", icon: "✈️", slug: "travel" },
    { name: "Electronics", icon: "📱", slug: "electronics" },
    { name: "Groceries", icon: "🛒", slug: "groceries" },
  ];

  return (
    <div className="min-h-screen pt-28 px-6 text-white flex flex-col items-center">
      <h1 className="text-4xl font-bold text-[#16FF6E] mb-10">
        Choose a Category
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-lg w-full">
        {categories.map((cat) => (
          <a
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="
              flex flex-col items-center justify-center
              p-6 rounded-xl border border-[#16FF6E]/40
              bg-black/30 backdrop-blur-sm
              hover:border-[#16FF6E] hover:bg-black/50
              transition-all shadow-[0_0_8px_rgba(22,255,110,0.3)]
              hover:shadow-[0_0_15px_rgba(22,255,110,0.5)]
            "
          >
            <span className="text-4xl">{cat.icon}</span>
            <span className="mt-3 text-lg">{cat.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
