import Link from "next/link";

export default function CategoriesPage() {
  const categories = [
    { name: "MOVIES", slug: "movies", tagline: "Last-Minute Deals" },
    { name: "LENSKART", slug: "lenskart", tagline: "Merge & Save" },
    { name: "TRAVEL", slug: "travel", tagline: "Mileage & Max" },
    { name: "GYM", slug: "gym", tagline: "Partner & Save" },
    { name: "CLOTHING", slug: "clothing", tagline: "Pair Offers" },
    { name: "FLASH EVENTS", slug: "flash", tagline: "Have Fun" }
  ];

  return (
    <main className="flex flex-col items-center py-16 text-white">
      <h1 className="text-4xl font-bold mb-10 text-[#16FF6E]">Choose a Category</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(c => (
          <Link
            key={c.slug}
            href={`/offers/${c.slug}`}
            className="neon-card min-w-[230px] text-center cursor-pointer"
          >
            <h2 className="text-lg font-bold">{c.name}</h2>
            <p className="text-sm opacity-80">{c.tagline}</p>
          </Link>
        ))}
      </div>

      <Link href="/" className="neon-btn-outline mt-12">Back Home</Link>
    </main>
  );
}
