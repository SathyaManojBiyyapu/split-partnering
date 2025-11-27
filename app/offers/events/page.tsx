export default function FlashOffers() {
    const offers = [
      {
        title: "Flash Hourly Deals ⚡",
        desc: "Limited stock + fastest checkout wins!",
        deal: "Ends in few hours",
      },
      {
        title: "High Reward Coupons 🏷",
        desc: "Apply at checkout for instant deduction.",
        deal: "100–500 extra savings",
      },
      {
        title: "Mystery Surprise Box 🎁",
        desc: "Random products with crazy value inside.",
        deal: "Priced lowest ever",
      },
    ];
  
    return (
      <PageTemplate
        title="⚡ Flash Deals"
        subtitle="Fastest sales — blink & you miss."
        offers={offers}
      />
    );
  }
  
  import PageTemplate from "@/app/components/PageTemplate";
  