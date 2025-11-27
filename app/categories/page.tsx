import Link from "next/link";

const categories = [
  {
    key: "lenskart",
    label: "Lenskart",
    description: "Eye-wear BOGO & frame splits.",
  },
  {
    key: "fashion",
    label: "Fashion",
    description: "Streetwear, fits & seasonal drops.",
  },
  {
    key: "movies",
    label: "Movies",
    description: "OTT + cinema tickets sharing.",
  },
  {
    key: "gym",
    label: "Gym & Fitness",
    description: "Passes, PT & supplement deals.",
  },
  {
    key: "travel",
    label: "Travel",
    description: "Flights, hotels & holiday splits.",
  },
  {
    key: "events",
    label: "Events / Flash",
    description: "Concerts, last-minute & flash drops.",
  },
];

export default function CategoriesPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-60px)] max-w-5xl flex-col items-center px-4 py-12 text-white">
      <h1 className="mb-3 text-3xl font-bold text-[#16FF6E]">
        Choose a category 🔍
      </h1>
      <p className="mb-10 max-w-xl text-center text-sm text-gray-300">
        Browse live offers in each bucket. Swipe on a card to request a partner.
      </p>

      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.key}
            href={`/offers/${cat.key}`}
            className="group rounded-2xl border border-[#16FF6E]/30 bg-gradient-to-br from-[#02150c] to-black p-[1px] shadow-[0_0_20px_rgba(22,255,110,0.2)] transition hover:border-[#16FF6E]"
          >
            <div className="flex h-full flex-col justify-between rounded-2xl bg-black/80 p-5">
              <div>
                <h2 className="mb-2 text-xl font-semibold group-hover:text-[#16FF6E]">
                  {cat.label}
                </h2>
                <p className="text-xs text-gray-300">{cat.description}</p>
              </div>
              <span className="mt-4 inline-flex items-center text-xs text-[#16FF6E]/80">
                View offers
                <span className="ml-1 text-sm">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
