export default function TravelOffers() {
    const offers = [
      {
        title: "Flight Discounts ✈️",
        desc: "International + Domestic lowest airfare deals.",
        deal: "Up to 48% OFF",
      },
      {
        title: "Hotel Stay Packages 🏨",
        desc: "Luxury, budget, romantic, family — all categories.",
        deal: "Book now & save big",
      },
      {
        title: "Holiday Experience Bundles 🌍",
        desc: "Bali, Goa, Singapore, Dubai & more.",
        deal: "Seasonal special pricing",
      },
    ];
  
    return (
      <PageTemplate
        title="🌍 Travel & Holiday Deals"
        subtitle="Trips, flights, hotels — at prices you'll love."
        offers={offers}
      />
    );
  }
  
  import PageTemplate from "@/app/components/PageTemplate";
''  