"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
  const [loggedIn, setLoggedIn] = useState(false);
  const [guest, setGuest] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("loggedIn") === "true") setLoggedIn(true);
    if (localStorage.getItem("guest") === "true") setGuest(true);
  }, []);

  return (
    <main className="min-h-screen text-white relative">

      {/* ================================
          TOP BAR (GUEST + LOGIN + ADMIN)
      ================================= */}
      <div className="fixed top-4 right-4 flex items-center gap-3 z-50">

        {/* Guest Button */}
        {!loggedIn && !guest && (
          <Link
            href="/login"
            className="px-3 py-1 bg-[#16FF6E]/20 border border-[#16FF6E]/40 text-[#16FF6E] rounded-full text-xs"
          >
            Continue as Guest / Login
          </Link>
        )}

        {/* Hidden Admin Button */}
        <button
          onClick={() => (window.location.href = "/admin")}
          className="text-[8px] opacity-20 hover:opacity-100 transition"
        >
          admin
        </button>
      </div>

      {/* Floating AI Chat Button */}
      <button
        onClick={() => (window.location.href = "/ai")}
        className="fixed bottom-6 right-6 bg-[#16FF6E] text-black px-4 py-3 rounded-full shadow-xl text-sm font-bold animate-pulse z-50"
      >
        AI Chat 🤖
      </button>

      {/* HERO */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-[#16FF6E]/30 bg-black/50 px-3 py-1 text-xs mb-4">
            <span className="h-2 w-2 rounded-full bg-[#16FF6E] shadow-[0_0_12px_#16FF6E] animate-pulse" />
            <span className="uppercase tracking-[0.18em] text-[10px] text-gray-300">
              First 5 partnerings are free
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
            Make your{" "}
            <span className="text-[#16FF6E] drop-shadow-[0_0_25px_#16FF6E]">
              first match
            </span>{" "}
            & pay less.
          </h1>

          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base mb-8">
            Partner with people who want the{" "}
            <span className="text-[#16FF6E] font-semibold">
              same deal or offer
            </span>{" "}
            and reduce your cost instantly.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Link
              href="/categories"
              className="px-6 py-3 rounded-full bg-[#16FF6E] text-black font-semibold shadow-[0_0_25px_rgba(22,255,110,0.7)] hover:bg-white transition-transform hover:-translate-y-0.5"
            >
              Make Your First Match 🚀
            </Link>

            <a
              href="#how-it-works"
              className="px-6 py-3 rounded-full border border-[#16FF6E]/40 bg-black/40 text-sm text-gray-200 hover:border-[#16FF6E] hover:bg-black/70 transition"
            >
              How SplitPartnering works
            </a>
          </div>

          <div className="flex flex-col items-center gap-1 text-xs text-gray-400">
            <span className="animate-bounce">↓</span>
            <span>Scroll to explore partner options</span>
          </div>
        </div>
      </section>

      {/* FEATURED DEALS */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-[#16FF6E]">
            Hot Partner Splits this week
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Tap any card to start your first match.
          </p>

          <div className="flex gap-5 overflow-x-auto pb-3">
            {featuredDeals.map((deal) => (
              <Link
                key={deal.label}
                href={`/options/${deal.categorySlug}`}
                className="min-w-[220px] sm:min-w-[260px] rounded-2xl border border-[#16FF6E]/40 bg-black/40 px-5 py-4 flex-shrink-0 hover:bg-black/80 hover:-translate-y-1 transition-all"
              >
                <div className="text-3xl mb-2">{deal.emoji}</div>
                <h3 className="font-semibold text-lg mb-1">
                  {deal.label}
                </h3>
                <p className="text-xs text-gray-300 mb-3">{deal.tagline}</p>
                <span className="inline-flex items-center gap-1 text-xs text-[#16FF6E]">
                  Make Match
                  <span className="text-[10px]">➜</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="pb-24 px-6 bg-gradient-to-b from-transparent via-black/20 to-black/70">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            All Partner Categories
          </h2>

          <p className="text-gray-400 text-sm mb-8">
            Choose a category → select option →{" "}
            <span className="text-[#16FF6E]">make your match</span>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/options/${cat.slug}`}
                className="group rounded-2xl border border-[#16FF6E]/30 bg-black/40 px-5 py-4 hover:border-[#16FF6E] hover:bg-black/80 hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-gray-400 group-hover:text-[#16FF6E]">
                    Make your first match
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
            Super simple. No marketplace — just matching.
          </p>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl bg-black/40 border border-[#16FF6E]/30 p-4">
              <p className="text-[#16FF6E] text-sm font-semibold mb-1">
                1 · Choose
              </p>
              <p className="text-xs text-gray-300">
                Login or continue as guest, pick a category and a deal.
              </p>
            </div>

            <div className="rounded-2xl bg-black/40 border border-[#16FF6E]/30 p-4">
              <p className="text-[#16FF6E] text-sm font-semibold mb-1">
                2 · Save Partner
              </p>
              <p className="text-xs text-gray-300">
                When you hit Save Partner, system creates a matching group.
              </p>
            </div>

            <div className="rounded-2xl bg-black/40 border border-[#16FF6E]/30 p-4">
              <p className="text-[#16FF6E] text-sm font-semibold mb-1">
                3 · Get Matched
              </p>
              <p className="text-xs text-gray-300">
                When the group fills, admin contacts all members.
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
