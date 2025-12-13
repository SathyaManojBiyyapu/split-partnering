"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { partneringInfo } from "@/app/data/partneringInfo";

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
    { name: "Save Ticket", slug: "save-ticket", description: "Partner so ticket value is not wasted", emoji: "🎬" },
    { name: "Bulk Ticket", slug: "bulk-ticket", description: "Form a group for booking benefits", emoji: "🎫" },
  ],
  lenskart: [
    { name: "Split Buy", slug: "splitbuy", description: "Partner eyewear purchase benefits", emoji: "👓" },
    { name: "Lens Split", slug: "lens-split", description: "Partner eyewear purchase benefits", emoji: "🔍" },
  ],
  "local-travel": [
    { name: "Car Rental", slug: "car", description: "Find travel partners & share cost", emoji: "🚗" },
    { name: "Bike Rental", slug: "bike", description: "Find travel partners & share cost", emoji: "🏍️" },
  ],
  events: [
    { name: "Couple Entry", slug: "couple-entry", description: "Partner for event entry benefits", emoji: "💑" },
    { name: "Group Save", slug: "group-save", description: "Form groups for event benefits", emoji: "👥" },
  ],
  coupons: [
    { name: "Best Deals", slug: "best-deals", description: "Partner to use offers effectively", emoji: "🎟️" },
    { name: "Gift Card", slug: "gift-card", description: "Partner to utilize gift cards", emoji: "🎁" },
  ],
  villas: [
    { name: "Room Booking", slug: "room", description: "Partner with another group", emoji: "🏡" },
    { name: "Weekend Stay", slug: "weekend", description: "Partner for shared villa stays", emoji: "🌴" },
  ],
  books: [
    { name: "Java", slug: "java", description: "Study partnering", emoji: "📚" },
    { name: "Python", slug: "python", description: "Study partnering", emoji: "🐍" },
    { name: "C Programming", slug: "c", description: "Study partnering", emoji: "📖" },
    { name: "DSA", slug: "dsa", description: "Study partnering", emoji: "📊" },
    { name: "OOPs", slug: "oops", description: "Study partnering", emoji: "🔷" },
    { name: "Computer Networks", slug: "cn", description: "Study partnering", emoji: "🌐" },
    { name: "DBMS", slug: "dbms", description: "Study partnering", emoji: "🗄️" },
    { name: "Operating Systems", slug: "os", description: "Study partnering", emoji: "💻" },
    { name: "Previous Papers", slug: "previous-papers", description: "Study partnering", emoji: "📝" },
  ],
};

const categoryNames: Record<string, string> = {
  gym: "Gym",
  fashion: "Fashion",
  movies: "Movies",
  lenskart: "Lenskart",
  "local-travel": "Local Travel",
  events: "Events",
  coupons: "Coupons",
  villas: "Villas",
  books: "Books",
};

export default function OptionsPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const options = categoryOptions[slug] || [];
  const categoryName = categoryNames[slug] || slug.replace("-", " ");
  const info = partneringInfo[slug];

  return (
    <div className="min-h-screen pt-32 px-6 text-white">
      <h1 className="text-3xl font-bold text-[#16FF6E] mb-2">{categoryName}</h1>
      <p className="text-gray-400 mb-8">
        Make your first match by choosing an option
      </p>

      {/* OPTIONS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {options.map((option) => (
          <Link
            key={option.slug}
            href={`/save?category=${slug}&option=${option.slug}`}
            className="p-6 rounded-xl border border-[#16FF6E]/40 bg-black/40 hover:bg-black/70 hover:border-[#16FF6E] transition-all shadow-lg"
          >
            <div className="text-4xl mb-3">{option.emoji}</div>
            <h2 className="text-xl font-semibold text-[#16FF6E] mb-2">
              {option.name}
            </h2>
            <p className="text-sm text-gray-300">{option.description}</p>
          </Link>
        ))}
      </div>

      {/* 🔥 CATEGORY INFO SECTION */}
      {info && (
        <div className="mt-10 max-w-3xl mx-auto text-sm text-green-200 border border-[#16FF6E]/20 p-4 rounded-xl bg-black/40">
          <h2 className="text-lg font-bold text-[#16FF6E] mb-1">
            {info.title}
          </h2>

          {info.topLine && (
            <p className="text-gray-300 mb-3">{info.topLine}</p>
          )}

          <ul className="space-y-3">
            {info.sections.map((sec: any, i: number) => (
              <li key={i}>
                <span className="font-semibold text-[#16FF6E]">
                  {sec.title}
                </span>
                <div className="text-gray-300">{sec.text}</div>
                {sec.example && (
                  <div className="text-gray-400 mt-1">
                    {sec.example}
                  </div>
                )}
              </li>
            ))}
          </ul>

          <p className="text-[11px] text-gray-400 mt-4 italic">
            SplitPartnering is a partnering service. We do not buy or sell any
            products or services. We only help people find partners.
          </p>
        </div>
      )}

      <div className="mt-10 text-center">
        <Link href="/categories" className="text-[#16FF6E] underline text-sm">
          ← Back to Categories
        </Link>
      </div>
    </div>
  );
}
