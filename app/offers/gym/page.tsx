export default function GymOffers() {
    const offers = [
      {
        title: "FitPass Multi-Gym 🎟",
        desc: "One subscription → access 50+ partnered gyms!",
        deal: "New users save 30%",
      },
      {
        title: "Personal Training 🏋️",
        desc: "1-on-1 fitness trainers for fast transformation.",
        deal: "Weekly + monthly plans",
      },
      {
        title: "Protein Supplements 💪",
        desc: "Whey, Creatine, Multivitamins — authentic only.",
        deal: "Flat ₹600 OFF",
      },
    ];
  
    return (
      <PageTemplate
        title="💪 Fitness & Gym Offers"
        subtitle="Health + pocket friendly workout offers."
        offers={offers}
      />
    );
  }
  
  import PageTemplate from "@/app/components/PageTemplate";
  