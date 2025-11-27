export default function MoviesOffers() {
    const offers = [
      {
        title: "Netflix Premium Discount 🎞",
        desc: "Watch unlimited movies & web-series in HD.",
        deal: "Save up to 40% today",
      },
      {
        title: "Amazon Prime Combo 🎥 + 🎵",
        desc: "Movies + Music + One-Day Delivery in one plan.",
        deal: "Starting ₹799/yr",
      },
      {
        title: "Disney+ Hotstar Sports Pack 🏏",
        desc: "IPL + Movies + Disney Originals + Cricket Unlimited.",
        deal: "Flat 28% Off",
      },
    ];
  
    return (
      <PageTemplate
        title="🎬 Movie Streaming Offers"
        subtitle="Top OTT subscriptions at best discounted pricing."
        offers={offers}
      />
    );
  }
  
  import PageTemplate from "@/app/components/PageTemplate";
  