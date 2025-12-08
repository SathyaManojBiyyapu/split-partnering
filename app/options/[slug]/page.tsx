"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const categoryOptions: Record<string, { name: string; slug: string; description: string; emoji: string }[]> = {
  gym: [
    { name: "Split Membership", slug: "split", description: "Share a gym membership with a partner", emoji: "💪" },
    { name: "Frame Only", slug: "frame", description: "Split the cost of eyewear frames", emoji: "👓" },
    { name: "Lens Only", slug: "lens", description: "Share lens costs", emoji: "🔍" },
    { name: "Day Pass", slug: "pass", description: "Split a day pass", emoji: "🎫" },
    { name: "Personal Trainer", slug: "trainer", description: "Share personal trainer sessions", emoji: "🏋️" },
    { name: "Supplements", slug: "supplements", description: "Split supplement costs (3 partners)", emoji: "💊" },
    { name: "Bundle Deal", slug: "bundle", description: "Share a bundle package", emoji: "📦" },
  ],
  fashion: [
    { name: "Seasonal Collection", slug: "season", description: "Split seasonal fashion items", emoji: "👗" },
    { name: "Accessories", slug: "accessories", description: "Share accessory costs", emoji: "👜" },
  ],
  movies: [
    { name: "Cinema Tickets", slug: "cinema", description: "Split movie tickets", emoji: "🎬" },
    { name: "OTT Subscription", slug: "ott", description: "Share streaming subscription", emoji: "📺" },
  ],
  lenskart: [
    { name: "Frame Only", slug: "frame", description: "Split the cost of eyewear frames", emoji: "👓" },
    { name: "Lens Only", slug: "lens", description: "Share lens costs", emoji: "🔍" },
  ],
  "local-travel": [
    { name: "Car Rental", slug: "car", description: "Share car rental (4 partners)", emoji: "🚗" },
    { name: "Bike Rental", slug: "bike", description: "Split bike rental", emoji: "🏍️" },
    { name: "Cab Share", slug: "cab", description: "Share cab costs (3 partners)", emoji: "🚕" },
  ],
  events: [
    { name: "Concert Tickets", slug: "concert", description: "Split concert tickets", emoji: "🎤" },
    { name: "Workshop", slug: "workshop", description: "Share workshop fees", emoji: "🎓" },
  ],
  coupons: [
    { name: "Unused Coupons", slug: "unused", description: "Share unused coupon codes", emoji: "🎟️" },
    { name: "Gift Cards", slug: "gift", description: "Split gift card purchases", emoji: "🎁" },
  ],
  villas: [
    { name: "Room Booking", slug: "room", description: "Share villa room (6 partners)", emoji: "🏡" },
    { name: "Weekend Stay", slug: "weekend", description: "Split weekend villa stay (4 partners)", emoji: "🌴" },
  ],
  books: [
    { name: "Study Material", slug: "material", description: "Share study materials", emoji: "📚" },
    { name: "Notes", slug: "notes", description: "Split notes costs", emoji: "📝" },
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

  if (!options.length) {
    return (
      <div className="min-h-screen pt-32 px-6 text-white text-center">
        <h1 className="text-3xl font-bold text-[#16FF6E] mb-4">Category Not Found</h1>
        <p className="text-gray-400 mb-6">This category doesn't have any options available.</p>
        <Link href="/categories" className="text-[#16FF6E] underline">
          ← Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 px-6 text-white">
      <h1 className="text-3xl font-bold text-[#16FF6E] mb-2">{categoryName} Options</h1>
      <p className="text-gray-400 mb-8">Choose an option to find your partner</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {options.map((option) => (
          <Link
            key={option.slug}
            href={`/save?category=${slug}&option=${option.slug}`}
            className="p-6 rounded-xl border border-[#16FF6E]/40 bg-black/40 hover:bg-black/70 hover:border-[#16FF6E] transition-all shadow-lg"
          >
            <div className="text-4xl mb-3">{option.emoji}</div>
            <h2 className="text-xl font-semibold text-[#16FF6E] mb-2">{option.name}</h2>
            <p className="text-sm text-gray-300">{option.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/categories" className="text-[#16FF6E] underline text-sm">
          ← Back to Categories
        </Link>
      </div>
    </div>
  );
}
