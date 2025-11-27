export default function FashionOffers() {
    const offers = [
      {
        title: "🔥 Streetwear & Oversized Tees",
        desc: "Top trending drops of 2025 — premium cotton fits.",
        deal: "Buy 2 Get 1 Free",
      },
      {
        title: "👗 Women's Trend Styles",
        desc: "Frocks, sarees, western sets, office wear — hottest picks!",
        deal: "Flat 50% OFF",
      },
      {
        title: "👜 Footwear, Bags & Accessories",
        desc: "Heels, sneakers, totes, chains — complete look upgrades.",
        deal: "Save up to ₹1200",
      },
    ];
  
    return (
      <PageTemplate
        title="💃 Fashion & Style Deals"
        subtitle="Latest trends — premium look at best price."
        offers={offers}
      />
    );
  }
  
  import PageTemplate from "@/app/components/PageTemplate";

  