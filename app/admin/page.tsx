const mockCategories = [
    { name: "Lenskart", pricePerSwipe: 10, freeSwipes: 5 },
    { name: "Fashion", pricePerSwipe: 15, freeSwipes: 5 },
    { name: "Movies", pricePerSwipe: 10, freeSwipes: 5 },
  ];
  
  export default function AdminPage() {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 text-white">
        <h1 className="mb-2 text-3xl font-bold text-[#16FF6E]">
          Admin Control Panel 🛠
        </h1>
        <p className="mb-8 text-sm text-gray-300">
          Visual shell only right now. Later you&apos;ll connect it with real
          APIs for pricing, free trial counts, refunds, and analytics.
        </p>
  
        <section className="mb-8 rounded-2xl border border-[#16FF6E]/30 bg-black/80 p-5">
          <h2 className="mb-3 text-sm font-semibold text-white">
            Category Pricing
          </h2>
          <div className="space-y-3 text-xs">
            {mockCategories.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2"
              >
                <span className="font-medium">{cat.name}</span>
                <span>₹{cat.pricePerSwipe} / swipe</span>
                <span>Free swipes: {cat.freeSwipes}</span>
              </div>
            ))}
          </div>
        </section>
  
        <section className="rounded-2xl border border-[#16FF6E]/30 bg-black/80 p-5 text-xs text-gray-300">
          <h2 className="mb-3 text-sm font-semibold text-white">
            Coming next (backend)
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Change pricing per category & save.</li>
            <li>Toggle categories ON/OFF.</li>
            <li>View payments & refund from here.</li>
            <li>Reset user free-swipes & block users.</li>
          </ul>
        </section>
      </main>
    );
  }
  