import OfferCard from "@/app/components/OfferCard";

const offersByCategory: Record<
  string,
  { title: string; description: string; priceText?: string; slug: string }[]
> = {
  lenskart: [
    {
      slug: "lenskart-bogo-basic",
      title: "Buy 1 Get 1 – Frames",
      description: "Split the cost of BOGO frames with another user.",
      priceText: "Approx split: ₹600 each",
    },
    {
      slug: "lenskart-office-bluecut",
      title: "Blue-cut Office Glasses",
      description: "Work-friendly lenses for long laptop sessions.",
      priceText: "Partner & save ~35%",
    },
  ],
  fashion: [
    {
      slug: "fashion-streetwear-pack",
      title: "Streetwear Combo Pack",
      description: "Oversized tees + cargos. Perfect for college fits.",
      priceText: "Split combo packs with a friend.",
    },
  ],
  movies: [
    {
      slug: "movies-ott-bundle",
      title: "OTT Bundle Split",
      description: "Netflix + Prime + Hotstar shared with your match.",
      priceText: "Each pays half the subscription.",
    },
  ],
  gym: [
    {
      slug: "gym-multi-city-pass",
      title: "Multi-Gym City Pass",
      description: "Access multiple gyms by splitting long-term pass.",
      priceText: "Share yearly pass with partner.",
    },
  ],
  travel: [
    {
      slug: "travel-airbnb-split",
      title: "Airbnb Stay Split",
      description: "Share stay cost for weekend trip.",
      priceText: "Match with travellers for same date.",
    },
  ],
  events: [
    {
      slug: "events-concert-row",
      title: "Concert Row Tickets",
      description: "Split pair tickets for concerts & shows.",
      priceText: "Find someone same seat row.",
    },
  ],
};

export default function CategoryOffersPage({
  params,
}: {
  params: { category: string };
}) {
  const category = params.category;
  const offers = offersByCategory[category] || [];

  const titleMap: Record<string, string> = {
    lenskart: "Lenskart",
    fashion: "Fashion",
    movies: "Movies & OTT",
    gym: "Gym & Fitness",
    travel: "Travel",
    events: "Events / Flash",
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-white">
      <h1 className="mb-2 text-3xl font-bold text-[#16FF6E]">
        {titleMap[category] || "Offers"}
      </h1>
      <p className="mb-8 text-sm text-gray-300">
        Tap a card to see more details and request a partner. First 5 swipes are
        free, after that normal swipe fees apply.
      </p>

      {offers.length === 0 ? (
        <p className="text-sm text-gray-400">No offers configured yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <OfferCard key={offer.slug} offer={offer} />
          ))}
        </div>
      )}
    </main>
  );
}
