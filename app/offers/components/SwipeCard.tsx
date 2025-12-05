"use client";

export default function SwipeCard({ offer, onSwipe }: any) {
  // SAFETY CHECKS
  if (!offer) {
    return (
      <div className="text-white text-center p-10">
        <h2 className="text-2xl">No offer data available ❌</h2>
      </div>
    );
  }

  const title = offer?.title ?? "Untitled Offer";
  const desc = offer?.desc ?? "No description available.";

  return (
    <div
      className="border border-[#16FF6E] p-6 rounded-xl bg-black/60 w-80 cursor-pointer"
      onClick={onSwipe}
    >
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-gray-300">{desc}</p>

      <p className="mt-5 text-sm text-[#16FF6E]">Tap to swipe →</p>
    </div>
  );
}
