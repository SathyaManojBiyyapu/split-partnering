"use client";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-start min-h-[80vh] pt-16 px-4">

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-[#16FF6E] drop-shadow-lg text-center">
        Swipe Offers in Fashion
      </h1>

      {/* Card */}
      <div className="
        mt-10 p-8 w-full max-w-md rounded-xl border border-[#16FF6E]/40 
        bg-black/30 backdrop-blur-md shadow-[0_0_20px_rgba(22,255,110,0.15)]
        transition-all hover:shadow-[0_0_35px_rgba(22,255,110,0.35)]
      ">
        <h2 className="text-2xl font-semibold text-white text-center">
          Zara Discount Split
        </h2>

        <p className="mt-3 text-gray-300 text-center">
          Team up for seasonal deals.
        </p>

        {/* Swipe Button */}
        <div className="mt-6 flex justify-center">
          <button
            className="px-6 py-2 rounded-full border border-[#16FF6E] text-[#16FF6E]
            hover:bg-[#16FF6E] hover:text-black transition-all shadow-[0_0_10px_rgba(22,255,110,0.5)]"
          >
            Tap to Swipe →
          </button>
        </div>
      </div>

      {/* Subtext */}
      <p className="mt-8 text-gray-400 text-sm text-center">
        More categories coming soon...
      </p>
    </main>
  );
}
