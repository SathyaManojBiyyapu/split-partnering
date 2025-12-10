// app/page.tsx
import Link from "next/link";

type FeaturedDeal = {
  label: string;
  categorySlug: string;
  optionSlug?: string;
  tagline: string;
  emoji: string;
};

type CategoryCard = {
  slug: string;
  label: string;
  emoji: string;
  line: string;
};

const featuredDeals: FeaturedDeal[] = [
  {
    label: "Zara Discount Split",
    categorySlug: "fashion",
    tagline: "Team up on seasonal fashion drops.",
    emoji: "👗",
  },
  {
    label: "Gym Pass Partner",
    categorySlug: "gym",
    tagline: "Share memberships. Pay less. Stay fit.",
    emoji: "🏋️",
  },
  {
    label: "Airport Cab Split",
    categorySlug: "local-travel",
    tagline: "Same route, half the cab bill.",
    emoji: "🚗",
  },
];

const categories: CategoryCard[] = [
  {
    slug: "gym",
    label: "Gym",
    emoji: "🏋️",
    line: "Split passes & supplements.",
  },
  {
    slug: "fashion",
    label: "Fashion",
    emoji: "👗",
    line: "Partner on brand offers.",
  },
  {
    slug: "movies",
    label: "Movies",
    emoji: "🎬",
    line: "Share tickets & combos.",
  },
  {
    slug: "lenskart",
    label: "Lenskart",
    emoji: "👓",
    line: "Split frames & lenses.",
  },
  {
    slug: "local-travel",
    label: "Local Travel",
    emoji: "🚘",
    line: "Car / bike / cab splits.",
  },
  {
    slug: "events",
    label: "Events",
    emoji: "🎤",
    line: "Concerts & show passes.",
  },
  {
    slug: "coupons",
    label: "Coupons",
    emoji: "🎟️",
    line: "Use your unused deals.",
  },
  {
    slug: "villas",
    label: "Villas",
    emoji: "🏡",
    line: "Group stays, split bills.",
  },
  {
    slug: "books",
    label: "Books",
    emoji: "📚",
    line: "Unlock study materials.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen text-white">
      {/* HERO */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* little glowing dot + label */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#16FF6E]/30 bg-black/50 px-3 py-1 text-xs mb-4">
            <span className="h-2 w-2 rounded-full bg-[#16FF6E] shadow-[0_0_12px_#16FF6E] animate-pulse" />
            <span className="uppercase tracking-[0.18em] text-[10px] text-gray-300">
              First 5 partnerings are free
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
            Partner on{" "}
            <span className="text-[#16FF6E] drop-shadow-[0_0_25px_#16FF6E]">
              real-world deals
            </span>{" "}
            & pay less.
          </h1>

          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base mb-8">
            No coupons, no spam. We just match people who want the{" "}
            <span className="text-[#16FF6E] font-semibold">
              same offer or service
            </span>{" "}
            so everyone pays less — and you stay anonymous until the deal is
            ready.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Link
              href="/categories"
              className="px-6 py-3 rounded-full bg-[#16FF6E] text-black font-semibold shadow-[0_0_25px_rgba(22,255,110,0.7)] hover:bg-white transition-transform hover:-translate-y-0.5"
            >
              Browse Categories 🚀
            </Link>

            <a
              href="#how-it-works"
              className="px-6 py-3 rounded-full border border-[#16FF6E]/40 bg-black/40 text-sm text-gray-200 hover:border-[#16FF6E] hover:bg-black/70 transition"
            >
              How SplitPartnering works
            </a>
          </div>

          {/* bouncing scroll hint */}
          <div className="flex flex-col items-center gap-1 text-xs text-gray-400">
            <span className="animate-bounce">↓</span>
            <span>Scroll to explore partner options</span>
          </div>
        </div>
      </section>

      {/* FEATURED SPLITS / SWIPE FEEL */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-[#16FF6E]">
            Hot Partner Splits this week
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            A quick peek at what people can partner on. Tap any card to start.
          </p>

          <div className="flex gap-5 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-[#16FF6E]/40 scrollbar-track-transparent">
            {featuredDeals.map((deal) => (
              <Link
                key={deal.label}
                href={`/options/${deal.categorySlug}`}
                className="min-w-[220px] sm:min-w-[260px] rounded-2xl border border-[#16FF6E]/40 bg-black/40 px-5 py-4 flex-shrink-0 hover:bg-black/80 hover:-translate-y-1 transition-all shadow-[0_0_25px_rgba(0,0,0,0.7)]"
              >
                <div className="text-3xl mb-2">{deal.emoji}</div>
                <h3 className="font-semibold text-lg mb-1">
                  {deal.label}
                </h3>
                <p className="text-xs text-gray-300 mb-3">{deal.tagline}</p>
                <span className="inline-flex items-center gap-1 text-xs text-[#16FF6E]">
                  View options
                  <span className="text-[10px]">➜</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="pb-24 px-6 bg-gradient-to-b from-transparent via-black/30 to-black/80">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            All Partner Categories
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Pick a category, choose a specific option inside, then{" "}
            <span className="text-[#16FF6E]">save a partner</span>. We handle
            the matching logic in the background.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/options/${cat.slug}`}
                className="group rounded-2xl border border-[#16FF6E]/30 bg-black/40 px-5 py-4 hover:border-[#16FF6E] hover:bg-black/80 hover:-translate-y-1 transition-all shadow-[0_0_25px_rgba(0,0,0,0.7)]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-gray-400 group-hover:text-[#16FF6E]">
                    tap to open
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[#16FF6E] mb-1">
                  {cat.label}
                </h3>
                <p className="text-xs text-gray-300">{cat.line}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="pb-24 px-6 border-t border-[#16FF6E]/10"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            How SplitPartnering works
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Super simple. No marketplace, no complex wallets — just matching.
          </p>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl bg-black/40 border border-[#16FF6E]/30 p-4">
              <p className="text-[#16FF6E] text-sm font-semibold mb-1">
                1 · Choose
              </p>
              <p className="text-xs text-gray-300">
                Login with OTP, pick a category like{" "}
                <span className="text-[#16FF6E]">Gym</span> or{" "}
                <span className="text-[#16FF6E]">Lenskart</span>, then select a
                precise option.
              </p>
            </div>

            <div className="rounded-2xl bg-black/40 border border-[#16FF6E]/30 p-4">
              <p className="text-[#16FF6E] text-sm font-semibold mb-1">
                2 · Save Partner
              </p>
              <p className="text-xs text-gray-300">
                When you hit <span className="text-[#16FF6E]">Save Partner</span>,
                we quietly place you into a matching group behind the scenes.
              </p>
            </div>

            <div className="rounded-2xl bg-black/40 border border-[#16FF6E]/30 p-4">
              <p className="text-[#16FF6E] text-sm font-semibold mb-1">
                3 · Get Matched
              </p>
              <p className="text-xs text-gray-300">
                Once the required number of partners is ready,{" "}
                <span className="text-[#16FF6E]">Admin contacts everyone</span>{" "}
                privately to complete the deal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY IT'S DIFFERENT / TRUST SECTION */}
      <section className="pb-16 px-6 bg-black/60 border-t border-[#16FF6E]/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Why this is different
          </h2>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl bg-black border border-[#16FF6E]/30 p-4">
              <p className="text-sm font-semibold text-[#16FF6E] mb-2">
                No reselling
              </p>
              <p className="text-xs text-gray-300">
                We don&apos;t sell anything. We just match people who already
                want the same deal.
              </p>
            </div>

            <div className="rounded-2xl bg-black border border-[#16FF6E]/30 p-4">
              <p className="text-sm font-semibold text-[#16FF6E] mb-2">
                Private & curated
              </p>
              <p className="text-xs text-gray-300">
                Your number is only used for matching and admin contact — no
                public groups or spam.
              </p>
            </div>

            <div className="rounded-2xl bg-black border border-[#16FF6E]/30 p-4">
              <p className="text-sm font-semibold text-[#16FF6E] mb-2">
                Built for savings
              </p>
              <p className="text-xs text-gray-300">
                The entire product exists for one job:{" "}
                <span className="text-[#16FF6E] font-semibold">
                  partner smart, pay less
                </span>
                .
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-300">
            <p>
              Ready to try? Start with{" "}
              <span className="text-[#16FF6E] font-semibold">
                any one category
              </span>{" "}
              and save a partner.
            </p>
            <Link
              href="/login"
              className="px-6 py-2 rounded-full bg-[#16FF6E]/10 border border-[#16FF6E]/60 text-[#16FF6E] hover:bg-[#16FF6E] hover:text-black transition"
            >
              Login / OTP →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
