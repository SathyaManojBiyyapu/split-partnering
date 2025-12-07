"use client";

const offersData: any = {
  gym: [
    { title: "Monthly Gym Pass", desc: "Split 1-month pass with another member." },
    { title: "Trainer Session Pack", desc: "Split 10 personal training sessions." },
    { title: "Supplements Bundle", desc: "Share bulk protein & vitamins." }
  ],

  fashion: [
    { title: "Seasonal Outfit Bundle", desc: "Split festival clothing combos." },
    { title: "Streetwear Drop Pack", desc: "Share 2–3 piece fashion combo." },
    { title: "Accessory Combo", desc: "Split sunglasses/bracelets/belts pack." }
  ],

  movies: [
    { title: "OTT Shared Access", desc: "Pair up for monthly streaming cost." },
    { title: "Cinema Seat Pair", desc: "Split 2-seat booking cost." },
    { title: "Weekend Movie Pack", desc: "Share popcorn + combo deal." }
  ],

  lenskart: [
    { title: "Frame Combo Pack", desc: "Split 2-frame offer with a partner." },
    { title: "Lens Upgrade Bundle", desc: "Share premium lenses upgrade cost." },
    { title: "Accessory Add-on", desc: "Split cleaning kit & accessories combo." }
  ],

  "local-travel": [
    { title: "City Ride Share", desc: "Match with someone on same route." },
    { title: "Airport Taxi Split", desc: "Share travel cost to/from airport." },
    { title: "Office Commute Match", desc: "Daily shared rides." }
  ],

  events: [
    { title: "Concert Pair Pass", desc: "Split 2-ticket combo." },
    { title: "Workshop Entry", desc: "Share group learning pack." },
    { title: "Festival Deal Pack", desc: "Split festive event entry combos." }
  ],

  coupons: [
    { title: "Unused Coupon Match", desc: "Exchange or match expiring coupons." },
    { title: "Gift Card Split", desc: "Share partial value gift cards." },
    { title: "Promo Deal", desc: "Match users for mutual discount deals." }
  ],

  villas: [
    { title: "Room Sharing Pack", desc: "Split villa room or night cost." },
    { title: "Weekend Group Stay", desc: "Find 3–4 people to share villa." },
    { title: "Holiday Home Deal", desc: "Split long-stay villa bookings." }
  ],

  books: [
    { title: "Study Material Bundle", desc: "Split printed or PDF exam materials." },
    { title: "Test Prep Combo", desc: "Share mock test or exam bundles." },
    { title: "Notes Exchange", desc: "Match and share notes." }
  ]
};

export default function OffersPage({ params }: any) {
  const { slug } = params;
  const offers = offersData[slug] || [];

  return (
    <div className="min-h-screen pt-28 px-6 text-white">
      <h1 className="text-3xl font-bold text-[#16FF6E] mb-8 capitalize">
        {slug.replace("-", " ")} Offers
      </h1>

      <div className="grid gap-6">
        {offers.map((offer: any, index: number) => (
          <div
            key={index}
            className="
              p-6 rounded-xl border border-[#16FF6E]/40 
              bg-black/30 backdrop-blur-sm 
              hover:border-[#16FF6E] transition-all shadow
            "
          >
            <h2 className="text-xl font-semibold">{offer.title}</h2>
            <p className="mt-2 text-gray-300">{offer.desc}</p>

            <button
              className="
                mt-4 px-4 py-2 rounded-full border border-[#16FF6E]
                text-[#16FF6E] hover:bg-[#16FF6E] hover:text-black 
                transition-all
              "
            >
              Swipe →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
