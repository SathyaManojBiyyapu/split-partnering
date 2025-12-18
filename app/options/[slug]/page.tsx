"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { partneringInfo } from "@/app/data/partneringInfo";

/* ---------------- CATEGORY OPTIONS ---------------- */

const categoryOptions: Record<
  string,
  { name: string; slug: string; description: string; emoji: string }[]
> = {
  gym: [
    { name: "Split Membership", slug: "split", description: "Partner to share a gym membership", emoji: "💪" },
    { name: "Day Pass", slug: "pass", description: "Partner for one-day gym access", emoji: "🎫" },
    { name: "Supplements", slug: "supplements", description: "Form a group to access bulk benefits", emoji: "💊" },
  ],
  fashion: [
    { name: "Peter England", slug: "peter-england", description: "Partner shopping for brand offers", emoji: "👔" },
    { name: "Louis Philippe", slug: "louis-philippe", description: "Partner shopping for brand offers", emoji: "👔" },
    { name: "Unlimited", slug: "unlimited", description: "Group shopping benefits", emoji: "👗" },
    { name: "Trends", slug: "trends", description: "Group shopping benefits", emoji: "👕" },
    { name: "Wrogn", slug: "wrogn", description: "Group shopping benefits", emoji: "👕" },
    { name: "Wildcraft", slug: "wildcraft", description: "Group shopping benefits", emoji: "🎒" },
    { name: "Zara", slug: "zara", description: "Partner shopping for brand offers", emoji: "👗" },
    { name: "H&M", slug: "hm", description: "Partner shopping for brand offers", emoji: "👕" },
    { name: "Nike", slug: "nike", description: "Partner shopping for brand offers", emoji: "👟" },
    { name: "Adidas", slug: "adidas", description: "Partner shopping for brand offers", emoji: "👟" },
  ],
  movies: [
    { name: "Save Ticket", slug: "save-ticket", description: "Sell or find movie tickets", emoji: "🎬" },
    { name: "Bulk Ticket", slug: "bulk-ticket", description: "Form a group for booking benefits", emoji: "🎫" },
  ],
};

const categoryNames: Record<string, string> = {
  gym: "Gym",
  fashion: "Fashion",
  movies: "Movies",
};

/* ---------------- PAGE ---------------- */

export default function OptionsPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const options = categoryOptions[slug] || [];
  const categoryName = categoryNames[slug] || slug.replace("-", " ");
  const info = partneringInfo[slug];

  return (
    <div className="min-h-screen pt-32 px-6 bg-black text-[#F5F5F5]">
      {/* HEADER */}
      <h1 className="text-3xl font-semibold text-[#FFD166] tracking-wide mb-2">
        {categoryName}
      </h1>
      <p className="text-gray-400 mb-10 text-sm">
        Choose an option to continue
      </p>

      {/* OPTIONS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {options.map((option) => {

          /* ===================== ADDED (NO REMOVAL) ===================== */
          const makePartnerSupported = Boolean(
            partneringInfo?.[slug]?.makePartner
          );

          const finalHref = makePartnerSupported
            ? `/make-partner?category=${slug}&option=${option.slug}`
            : `/save?category=${slug}&option=${option.slug}`;
          /* =============================================================== */

          /* 🎬 SPECIAL CASE: MOVIES → SAVE TICKET */
          if (slug === "movies" && option.slug === "save-ticket") {
            return (
              <div
                key={option.slug}
                className="
                  p-6 rounded-2xl
                  border border-[#FFD166]/30
                  bg-gradient-to-b from-[#0c0c0c] to-black
                  shadow-[0_0_20px_#FFD16622]
                "
              >
                <div className="text-4xl mb-3">{option.emoji}</div>

                <h2 className="text-lg font-semibold text-[#FFD166] mb-2">
                  {option.name}
                </h2>

                <p className="text-sm text-gray-400 mb-6">
                  {option.description}
                </p>

                <div className="flex flex-col gap-4">
                  <Link
                    href="/movies/trade-ticket"
                    className="
                      text-center px-6 py-3 rounded-xl font-semibold
                      bg-black text-[#E6C972]
                      border border-[#E6C972]
                      hover:bg-[#F3DC8A]
                      hover:text-black
                      transition
                    "
                  >
                    🎟️ Trade Tickets
                  </Link>

                  <Link
                    href="/movies/available-tickets"
                    className="
                      text-center px-6 py-3 rounded-xl font-semibold
                      border border-gray-500
                      hover:bg-white/10
                      transition
                    "
                  >
                    👀 Available Tickets
                  </Link>
                </div>
              </div>
            );
          }

          /* 🔁 ALL OTHER OPTIONS (UNCHANGED UI) */
          return (
            <Link
              key={option.slug}

              /* 🔽 ORIGINAL LINE KEPT (NOT REMOVED)
              href={`/save?category=${slug}&option=${option.slug}`}
              */

              /* ✅ ADDED: override destination safely */
              href={finalHref}

              className="
                p-6 rounded-2xl
                border border-[#FFD166]/30
                bg-gradient-to-b from-[#0c0c0c] to-black
                hover:border-[#FFD166]
                hover:shadow-[0_0_20px_#FFD16633]
                transition-all duration-300
              "
            >
              <div className="text-4xl mb-3">{option.emoji}</div>

              <h2 className="text-lg font-semibold text-[#FFD166] mb-2">
                {option.name}
              </h2>

              <p className="text-sm text-gray-400">
                {option.description}
              </p>
            </Link>
          );
        })}
      </div>

      {/* CATEGORY INFO */}
      {info && (
        <div className="
          mt-14 max-w-3xl mx-auto
          border border-[#FFD166]/20
          p-6 rounded-2xl
          bg-gradient-to-br from-[#0e0e0e] to-black
        ">
          <h2 className="text-lg font-semibold text-[#FFD166] mb-2">
            {info.title}
          </h2>
          <p className="text-gray-400 text-sm">
            {info.topLine}
          </p>
        </div>
      )}

      {/* BACK */}
      <div className="mt-14 text-center">
        <Link
          href="/categories"
          className="text-[#FFD166] text-sm tracking-wide hover:underline"
        >
          ← Back to Categories
        </Link>
      </div>
    </div>
  );
}
