import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-60px)] flex-col items-center justify-center bg-[radial-gradient(circle_at_top,#062f1a,#000)] px-4 text-white">
      <div className="text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#16FF6E]/80">
          Match • Split • Save
        </p>
        <h1 className="mb-4 text-5xl font-extrabold text-[#16FF6E] drop-shadow-[0_0_30px_#16FF6E]">
          Welcome 👋
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-base text-gray-200">
          Turn solo offers into shared wins. Pick a category, swipe on a deal,
          and we&apos;ll find your partner to split the cost.
        </p>

        <Link
          href="/categories"
          className="rounded-full bg-[#16FF6E] px-8 py-3 text-lg font-semibold text-black shadow-[0_0_25px_#16FF6E] transition hover:scale-105"
        >
          Browse Categories 🚀
        </Link>

        <p className="mt-4 text-xs text-gray-400">
          First 5 partnerings are <span className="text-[#16FF6E]">free</span>.
        </p>
      </div>
    </main>
  );
}
