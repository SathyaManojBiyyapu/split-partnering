"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/* ================= TYPES ================= */

type FeaturedDeal = {
  label: string;
  categorySlug: string;
  tagline: string;
  emoji: string;
};

type CategoryCard = {
  slug: string;
  label: string;
  emoji: string;
  line: string;
};

/* ================= DATA ================= */

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

/* ================= PAGE ================= */

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [guest, setGuest] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("loggedIn") === "true") setLoggedIn(true);
    if (localStorage.getItem("guest") === "true") setGuest(true);
  }, []);

  return (
    <main className="min-h-screen bg-black text-text-body font-body">

      {/* ================= HERO ================= */}
      <section className="pt-36 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-tight text-gold-primary mb-6">
            Sync. Split. Save.
          </h1>

          <p className="text-text-muted text-base sm:text-lg max-w-2xl mx-auto mb-12">
            PartnerSync is a collaboration platform designed to help individuals
            and groups reduce everyday expenses through structured,
            transparent, and trusted partnerships.
          </p>

          <div className="flex justify-center gap-4">
            <Link href="/categories" className="btn-primary">
              Explore Partnerships
            </Link>
            <a href="#overview" className="btn-outline">
              Platform Overview
            </a>
          </div>
        </div>
      </section>

      {/* ================= PLATFORM OVERVIEW ================= */}
      <section id="overview" className="pb-28 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="rounded-2xl border border-dark-card bg-dark-section p-8">
            <p className="text-xl font-heading text-gold-primary mb-2">
              Early Market Traction
            </p>
            <p className="text-sm text-text-muted">
              Growing interest in collaborative cost-sharing models
            </p>
          </div>

          <div className="rounded-2xl border border-dark-card bg-dark-section p-8">
            <p className="text-xl font-heading text-gold-primary mb-2">
              Active Partner Matching
            </p>
            <p className="text-sm text-text-muted">
              Real users forming intent-based groups
            </p>
          </div>

          <div className="rounded-2xl border border-dark-card bg-dark-section p-8">
            <p className="text-xl font-heading text-gold-primary mb-2">
              Multi-Category Coverage
            </p>
            <p className="text-sm text-text-muted">
              Designed to scale across diverse everyday needs
            </p>
          </div>
        </div>
      </section>

      {/* ================= FEATURED PARTNERSHIPS ================= */}
      <section className="pb-28 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl mb-4">
            Featured partnership opportunities
          </h2>

          <p className="text-text-muted text-sm mb-10">
            Examples of how PartnerSync enables real-world collaboration.
          </p>

          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
            {featuredDeals.map((deal) => (
              <Link
                key={deal.label}
                href={`/options/${deal.categorySlug}`}
                className="
                  min-w-[240px] snap-start
                  rounded-2xl border border-dark-card
                  bg-dark-section px-6 py-7
                  hover:-translate-y-1
                  hover:shadow-[0_0_32px_rgba(212,175,55,0.3)]
                  transition
                "
              >
                <div className="text-3xl mb-4">{deal.emoji}</div>
                <h3 className="font-heading text-lg mb-2">{deal.label}</h3>
                <p className="text-sm text-text-muted">{deal.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY PARTNERSYNC ================= */}
      <section className="pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-2xl sm:text-3xl mb-8">
            Why PartnerSync exists
          </h2>

          <p className="text-text-muted text-sm leading-relaxed whitespace-pre-line">
            Many everyday purchases become significantly cheaper when people collaborate.
            Yet, most group-buying efforts fail due to lack of trust, poor coordination,
            and unclear accountability.

            PartnerSync addresses this gap by offering a structured,
            admin-moderated platform where users can form verified
            cost-sharing partnerships with confidence.

            There is no selling, no pressure, and no forced interactions —
            only transparent coordination designed for real-world use.

            Users do not negotiate prices.
            They do not chase participants.
            They do not manage chaos.

            The system handles coordination intelligently.
          </p>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="pb-32 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl mb-4">
            Partnership categories
          </h2>

          <p className="text-text-muted text-sm mb-12">
            PartnerSync is designed to support both everyday and high-value
            collaborative use cases.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/options/${cat.slug}`}
                className="
                  rounded-2xl border border-dark-card
                  bg-dark-section px-6 py-7
                  hover:-translate-y-1
                  hover:shadow-[0_0_28px_rgba(212,175,55,0.25)]
                  transition
                "
              >
                <div className="text-2xl mb-3">{cat.emoji}</div>
                <h3 className="font-heading text-lg mb-2">{cat.label}</h3>
                <p className="text-sm text-text-muted">{cat.line}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="pb-32 px-6 border-t border-dark-card">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl mb-4">
            How PartnerSync works
          </h2>

          <p className="text-text-muted text-sm mb-12">
            A simple, structured, and transparent collaboration flow.
          </p>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl bg-dark-section border border-dark-card p-6">
              <p className="font-heading mb-2">1 · Sync</p>
              <p className="text-sm text-text-muted">
                Select a category and express your intent to collaborate.
              </p>
            </div>

            <div className="rounded-2xl bg-dark-section border border-dark-card p-6">
              <p className="font-heading mb-2">2 · Split</p>
              <p className="text-sm text-text-muted">
                Get matched with compatible partners through the system.
              </p>
            </div>

            <div className="rounded-2xl bg-dark-section border border-dark-card p-6">
              <p className="font-heading mb-2">3 · Save</p>
              <p className="text-sm text-text-muted">
                Complete the collaboration and reduce individual costs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="pb-32 px-6 border-t border-dark-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-2xl sm:text-3xl mb-6">
            Transparency & trust
          </h2>

          <p className="text-text-muted text-sm leading-relaxed">
            PartnerSync does not sell products or services.
            It functions purely as a coordination and discovery platform.
            All collaborations remain user-driven and admin-monitored,
            ensuring safety, clarity, and accountability at every stage.
          </p>
        </div>
      </section>

    </main>
  );
}
