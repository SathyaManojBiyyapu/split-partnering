import Link from "next/link";

const OFFER_DETAILS: Record<
  string,
  { title: string; description: string; highlight: string; category: string }
> = {
  "lenskart-bogo-basic": {
    title: "Lenskart – Buy 1 Get 1 Frames",
    description:
      "You and your partner both pick frames. Pay once, both get glasses. We just help you find the other person.",
    highlight: "2 people split BOGO and both win.",
    category: "Lenskart",
  },
  "fashion-streetwear-pack": {
    title: "Streetwear Combo – 4 Tees + 2 Bottoms",
    description:
      "Bundle is too big for one person? Split sizing with a partner having similar vibe.",
    highlight: "Cut cost by up to 50%.",
    category: "Fashion",
  },
};

export default function OfferDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const offer = OFFER_DETAILS[params.slug];

  if (!offer) {
    return (
      <main className="flex min-h-[calc(100vh-60px)] items-center justify-center text-gray-300">
        Offer not found.
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-60px)] max-w-3xl flex-col gap-6 px-4 py-10 text-white">
      <div className="rounded-3xl border border-[#16FF6E]/40 bg-gradient-to-br from-[#03160e] to-black p-[1px] shadow-[0_0_25px_rgba(22,255,110,0.4)]">
        <div className="rounded-3xl bg-black/95 p-6">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#16FF6E]/80">
            {offer.category}
          </p>
          <h1 className="mb-3 text-2xl font-bold text-[#16FF6E]">
            {offer.title}
          </h1>
          <p className="mb-3 text-sm text-gray-200">{offer.description}</p>
          <p className="text-xs text-[#16FF6E]/90">{offer.highlight}</p>
        </div>
      </div>

      {/* Fake swipe / match UI */}
      <div className="rounded-2xl border border-[#16FF6E]/30 bg-black/80 p-5">
        <h2 className="mb-2 text-sm font-semibold text-white">
          Request a partner for this offer
        </h2>
        <p className="mb-4 text-xs text-gray-300">
          First <span className="text-[#16FF6E] font-semibold">5</span> partner
          swipes are free. From 6th swipe, a small fee applies per category.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative h-11 w-56 rounded-full border border-[#16FF6E]/40 bg-[#03150d] px-3 text-xs text-gray-200 flex items-center">
            <span className="mr-2 text-[#16FF6E] text-sm">2+</span>
            <span className="truncate">
              Drag to request match (mock right now)
            </span>
            <div className="absolute right-[3px] top-[3px] h-9 w-9 rounded-full bg-[#16FF6E] shadow-[0_0_18px_#16FF6E] flex items-center justify-center text-black text-lg">
              →
            </div>
          </div>

          <button className="rounded-full border border-[#16FF6E]/40 bg-black px-4 py-2 text-xs font-semibold text-[#16FF6E] shadow-[0_0_15px_rgba(22,255,110,0.35)] hover:border-[#16FF6E]">
            (Future) Swipe & Pay
          </button>
        </div>
      </div>

      <Link
        href="/dashboard"
        className="text-xs text-[#16FF6E] underline underline-offset-2"
      >
        Go to My Matches →
      </Link>
    </main>
  );
}

