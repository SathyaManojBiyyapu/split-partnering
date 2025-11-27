import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center py-16 text-white">
      <h1 className="text-5xl font-bold text-[#16FF6E] mb-8">Welcome 👋</h1>

      <p className="text-lg opacity-80 mb-12 text-center max-w-xl">
        Choose a category to view offers.
      </p>

      <Link
        href="/categories"
        className="neon-btn text-xl px-6 py-3 rounded-md mt-4 cursor-pointer"
      >
        Browse Categories 🚀
      </Link>
    </main>
  );
}
