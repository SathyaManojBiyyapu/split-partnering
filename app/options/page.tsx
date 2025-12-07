"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function OptionsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";

  const categoryOptions: any = {
    lenskart: [
      { name: "Split & Buy", slug: "split" },
      { name: "Frame Combo", slug: "frame" },
      { name: "Lens Upgrade", slug: "lens" },
    ],
    gym: [
      { name: "Monthly Pass", slug: "pass" },
      { name: "Trainer Sessions", slug: "trainer" },
      { name: "Supplements", slug: "supplements" },
    ],
    fashion: [
      { name: "Outfit Bundle", slug: "bundle" },
      { name: "Seasonal Wear", slug: "season" },
      { name: "Accessories", slug: "accessories" },
    ],
    movies: [
      { name: "Cinema Pair", slug: "cinema" },
      { name: "OTT Sharing", slug: "ott" },
    ],
    "local-travel": [
      { name: "Car Split", slug: "car" },
      { name: "Bike Split", slug: "bike" },
      { name: "Cab Share", slug: "cab" },
    ],
    events: [
      { name: "Concert Pass", slug: "concert" },
      { name: "Workshop Ticket", slug: "workshop" },
    ],
    coupons: [
      { name: "Unused Coupons", slug: "unused" },
      { name: "Gift Cards", slug: "gift" },
    ],
    villas: [
      { name: "Room Share", slug: "room" },
      { name: "Weekend Stay", slug: "weekend" },
    ],
    books: [
      { name: "Exam Materials", slug: "material" },
      { name: "Notes Sharing", slug: "notes" },
    ],
  };

  const options = categoryOptions[category] || [];

  return (
    <div className="min-h-screen pt-28 px-6 text-white">
      <h1 className="text-3xl font-bold text-[#16FF6E] mb-6">
        {category ? category.replace("-", " ").toUpperCase() : "Options"}
      </h1>

      <div className="grid gap-4">
        {options.map((item: any) => (
          <a
            key={item.slug}
            href={`/save?category=${category}&option=${item.slug}`}
            className="p-5 rounded-xl border border-[#16FF6E]/40 bg-black/40 hover:bg-black/70 transition-all"
          >
            <h2 className="text-xl">{item.name}</h2>
          </a>
        ))}
      </div>
    </div>
  );
}

// MUST wrap in Suspense to avoid Vercel build failure
export default function OptionsPage() {
  return (
    <Suspense fallback={<p className="text-white p-10">Loading options...</p>}>
      <OptionsContent />
    </Suspense>
  );
}
