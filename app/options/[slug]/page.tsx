"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const categoryOptions: Record<
  string,
  { name: string; slug: string; description: string; emoji: string }[]
> = {
  gym: [
    { name: "Split Membership", slug: "split", description: "Share a gym membership with a partner", emoji: "💪" },
    { name: "Day Pass", slug: "pass", description: "Split a day pass", emoji: "🎫" },
    { name: "Supplements", slug: "supplements", description: "Split supplement costs (3 partners)", emoji: "💊" },
  ],
  fashion: [
    { name: "Peter England", slug: "peter-england", description: "Share Peter England deals", emoji: "👔" },
    { name: "Louis Philippe", slug: "louis-philippe", description: "Split Louis Philippe purchases", emoji: "👔" },
    { name: "Unlimited", slug: "unlimited", description: "Share Unlimited fashion deals", emoji: "👗" },
    { name: "Trends", slug: "trends", description: "Split Trends fashion items", emoji: "👕" },
    { name: "Wrogn", slug: "wrogn", description: "Share Wrogn deals", emoji: "👕" },
    { name: "Wildcraft", slug: "wildcraft", description: "Split Wildcraft purchases", emoji: "🎒" },
    { name: "Zara", slug: "zara", description: "Share Zara fashion deals", emoji: "👗" },
    { name: "H&M", slug: "hm", description: "Split H&M purchases", emoji: "👕" },
    { name: "Nike", slug: "nike", description: "Share Nike deals", emoji: "👟" },
    { name: "Adidas", slug: "adidas", description: "Split Adidas purchases", emoji: "👟" },
  ],
  movies: [
    { name: "Save Ticket", slug: "save-ticket", description: "Split movie tickets", emoji: "🎬" },
    { name: "Bulk Ticket", slug: "bulk-ticket", description: "Share bulk ticket deals", emoji: "🎫" },
  ],
  lenskart: [
    { name: "Split Buy", slug: "splitbuy", description: "Share eyewear purchases", emoji: "👓" },
    { name: "Lens Split", slug: "lens-split", description: "Split lens costs", emoji: "🔍" },
  ],
  "local-travel": [
    { name: "Car Rental", slug: "car", description: "Share car rental (4 partners)", emoji: "🚗" },
    { name: "Bike Rental", slug: "bike", description: "Split bike rental", emoji: "🏍️" },
  ],
  events: [
    { name: "Couple Entry", slug: "couple-entry", description: "Split couple entry tickets", emoji: "💑" },
    { name: "Group Save", slug: "group-save", description: "Share group event tickets (4 partners)", emoji: "👥" },
  ],
  coupons: [
    { name: "Best Deals", slug: "best-deals", description: "Share best coupon deals", emoji: "🎟️" },
    { name: "Gift Card", slug: "gift-card", description: "Split gift card purchases", emoji: "🎁" },
  ],
  villas: [
    { name: "Room Booking", slug: "room", description: "Share villa room (6 partners)", emoji: "🏡" },
    { name: "Weekend Stay", slug: "weekend", description: "Split weekend villa stay (4 partners)", emoji: "🌴" },
  ],
  books: [
    { name: "Java", slug: "java", description: "Share Java study materials", emoji: "📚" },
    { name: "Python", slug: "python", description: "Split Python books", emoji: "🐍" },
    { name: "C Programming", slug: "c", description: "Share C programming books", emoji: "📖" },
    { name: "DSA", slug: "dsa", description: "Split Data Structures books", emoji: "📊" },
    { name: "OOPs", slug: "oops", description: "Share OOPs study materials", emoji: "🔷" },
    { name: "Computer Networks", slug: "cn", description: "Split CN study materials", emoji: "🌐" },
    { name: "DBMS", slug: "dbms", description: "Share DBMS books", emoji: "🗄️" },
    { name: "Operating Systems", slug: "os", description: "Split OS study materials", emoji: "💻" },
    { name: "Previous Papers", slug: "previous-papers", description: "Share previous exam papers", emoji: "📝" },
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
      <h1 className="text-3xl font-bold text-[#16FF6E] mb-2">{categoryName}</h1>
      <p className="text-gray-400 mb-8">Make your first match by choosing an option</p>

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
