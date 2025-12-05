// app/offers/[slug]/page.tsx
"use client";

import SwipeCard from "../components/SwipeCard";

const offersData: Record<string, { title: string; description: string }[]> = {
  lenskart: [
    { title: "Buy 1 Get 1 Free Frames", description: "Partner to split cost!" },
    { title: "Gold Membership Split", description: "Share benefits together." }
  ],
  fashion: [
    { title: "Streetwear Drop", description: "Split Buy 1 Get 1 deal." },
    { title: "Sneaker Sale", description: "Split limited edition sneakers." }
  ],
  movies: [
    { title: "PVR Buy 1 Get 1", description: "Share ticket cost." }
  ],
  gym: [
    { title: "Gym Pass Split", description: "Share 1-month pass." }
  ],
  travel: [
    { title: "Hotel Room Split", description: "Split premium room price." }
  ],
  events: [
    { title: "Concert Tickets BOGO", description: "Partner up to split cost." }
  ]
};

export default function OffersPage({ params }: any) {
  const { slug } = params;
  console.log("offers page slug:", slug); // debug
  const items = offersData[slug] || [];
  const onSwipe = (direction: string, offer: any) => {
    console.log("swipe:", direction, offer);
    // TODO: save to Firestore
  };

  return (
    <main className="text-white px-4 py-10">
      <h1 className="text-3xl font-bold text-[#16FF6E] mb-6 capitalize">{slug} Offers 🎯</h1>
      <SwipeCard items={items} onSwipe={onSwipe} />
    </main>
  );
}
