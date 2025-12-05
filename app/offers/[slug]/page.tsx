"use client";

import { useState } from "react";
import SwipeCard from "../components/SwipeCard";
import Link from "next/link";

const offersData: any = {
  lenskart: [
    { title: "Buy 1 Get 1 Free Frames", desc: "Split BOGO with a partner!" },
    { title: "Gold Membership Split", desc: "Share membership benefits." },
  ],
  fashion: [
    { title: "Zara Discount Split", desc: "Team up for seasonal deals." },
    { title: "H&M Buy 2 Get 1", desc: "Find a partner to split offer." },
  ],
  movies: [
    { title: "BookMyShow 50% Off", desc: "Split movie ticket offers." },
    { title: "OTT Subscription Split", desc: "Partner to reduce cost." },
  ],
  gym: [
    { title: "CultFit Membership", desc: "Find a partner to split." },
    { title: "GoldGym 2-person Plan", desc: "Save more with splitting." },
  ],
  travel: [
    { title: "Hotel Room Sharing", desc: "Share room fees safely." },
    { title: "Flight Discount Split", desc: "Partner for promo deals." },
  ],
  events: [
    { title: "Concert Ticket Split", desc: "Team up for event passes!" },
    { title: "Flash Deals", desc: "Partner quickly before sold out." },
  ],
};

export default function OfferSwipePage({ params }: any) {
  const slug = params.slug.toLowerCase();

  const offers = offersData[slug] || [];
  const [index, setIndex] = useState(0);

  const handleSwipe = () => {
    setIndex((prev: number) => prev + 1);
  };

  if (!offers.length) {
    return (
      <main className="text-center text-white p-10">
        <h1 className="text-3xl font-bold text-[#16FF6E] mb-3">
          No offers found 🚫
        </h1>
        <p className="text-gray-300 mb-6">
          This category doesn't have any offers yet.
        </p>

        <Link
          href="/categories"
          className="underline text-[#16FF6E] text-lg"
        >
          ← Back to Categories
        </Link>
      </main>
    );
  }

  const currentOffer = offers[index];

  if (!currentOffer) {
    return (
      <main className="text-center text-white p-10">
        <h1 className="text-3xl font-bold text-[#16FF6E] mb-3">
          No more offers 🎉
        </h1>
        <p className="text-gray-300 mb-6">
          You viewed all offers in this category.
        </p>

        <Link
          href="/categories"
          className="underline text-[#16FF6E] text-lg"
        >
          ← Back to Categories
        </Link>
      </main>
    );
  }

  return (
    <main className="text-center flex flex-col items-center p-10 text-white">
      <h1 className="text-3xl font-bold text-[#16FF6E] mb-6">
        Swipe Offers in {slug[0].toUpperCase() + slug.slice(1)}
      </h1>

      <SwipeCard offer={currentOffer} onSwipe={handleSwipe} />
    </main>
  );
}
