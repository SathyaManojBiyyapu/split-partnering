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
    tagline: "Collaborate on seasonal fashion purchases.",
    emoji: "👗",
  },
  {
    label: "Gym Membership Partner",
    categorySlug: "gym",
    tagline: "Reduce fitness costs through shared plans.",
    emoji: "🏋️",
  },
  {
    label: "Airport Cab Split",
    categorySlug: "local-travel",
    tagline: "Lower travel expenses through route matching.",
    emoji: "🚗",
  },
];

const categories: CategoryCard[] = [
  { slug: "gym", label: "Gym", emoji: "🏋️", line: "Shared memberships & supplements." },
  { slug: "fashion", label: "Fashion", emoji: "👗", line: "Partner-driven brand offers." },
  { slug: "movies", label: "Movies", emoji: "🎬", line: "Split tickets & combos." },
  { slug: "lenskart", label: "Lenskart", emoji: "👓", line: "Shared eyewear deals." },
  { slug: "local-travel", label: "Local Travel", emoji: "🚘", line: "Cab, bike & route sharing." },
  { slug: "events", label: "Events", emoji: "🎤", line: "Concerts & experiences." },
  { slug: "coupons", label: "Coupons", emoji: "🎟️", line: "Unused offers unlocked." },
  { slug: "villas", label: "Villas", emoji: "🏡", line: "Group stays, optimized pricing." },
  { slug: "books", label: "Books", emoji: "📚", line: "Shared access to study material." },
];

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [guest, setGuest] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("loggedIn") === "true") setLoggedIn(true);
    if (localStorage.getItem("guest") === "true") setGuest(true);
  }, []);

  return (
    <main className="min-h-screen relative font-body">

      {/* HERO */}
      <section className="pt-32 pb-28 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl leading-tight mb-6">
            PartnerSync enables
            <br />
            smarter cost-sharing partnerships
          </h1>

          <p className="text-text-muted text-sm sm:text-lg max-w-2xl mx-auto mb-10">
            A collaboration platform that connects individuals and businesses
            to reduce expenses through structured partner matching.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-sm mb-12">
            <div className="border border-dark-card rounded-xl p-4">
              Cost optimization through collaboration
            </div>
            <div className="border border-dark-card rounded-xl p-4">
              Secure & structured partner matching
            </div>
            <div className="border border-dark-card rounded-xl p-4">
              Scalable across multiple categories
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/categories" className="btn-primary">
              Explore Partnerships
            </Link>

            <a href="#how-it-works" className="btn-outline">
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* FEATURED DEALS */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl mb-2">
            Featured partnerships
          </h2>

          <p className="text-text-muted text-sm mb-8">
            Early traction across high-demand categories.
          </p>

          <div className="flex gap-6 overflow-x-auto pb-3">
            {featuredDeals.map((deal) => (
              <Link
                key={deal.label}
                href={`/options/${deal.categorySlug}`}
                className="min-w-[216px] rounded-2xl border border-dark-card bg-dark-section px-5 py-5 hover:-translate-y-1 transition"
              >
                <div className="text-3xl mb-3">{deal.emoji}</div>
                <h3 className="font-heading text-lg mb-1">{deal.label}</h3>
                <p className="text-sm text-text-muted">{deal.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="pb-28 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl mb-2">
            Partnership categories
          </h2>

          <p className="text-text-muted text-sm mb-10">
            Designed to scale across consumer and enterprise use cases.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/options/${cat.slug}`}
                className="rounded-2xl border border-dark-card bg-dark-section px-5 py-5 hover:-translate-y-1 transition"
              >
                <div className="text-2xl mb-3">{cat.emoji}</div>
                <h3 className="font-heading text-lg mb-1">{cat.label}</h3>
                <p className="text-sm text-text-muted">{cat.line}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="pb-28 px-6 border-t border-dark-card">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl mb-2">
            How PartnerSync works
          </h2>

          <p className="text-text-muted text-sm mb-10">
            Simple workflow designed for scale.
          </p>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl bg-dark-section border border-dark-card p-5">
              <p className="font-heading mb-1">1 · Select</p>
              <p className="text-sm text-text-muted">
                Choose a category and partnership option.
              </p>
            </div>

            <div className="rounded-2xl bg-dark-section border border-dark-card p-5">
              <p className="font-heading mb-1">2 · Match</p>
              <p className="text-sm text-text-muted">
                Our system forms optimized partner groups.
              </p>
            </div>

            <div className="rounded-2xl bg-dark-section border border-dark-card p-5">
              <p className="font-heading mb-1">3 · Execute</p>
              <p className="text-sm text-text-muted">
                Partners are connected and transactions proceed.
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
