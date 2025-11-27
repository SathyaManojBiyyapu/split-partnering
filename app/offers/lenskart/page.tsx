export default function LenskartOffers() {
    const offers = [
      {
        title: "50% OFF Frames 🤓",
        desc: "Anti-glare & premium lenses at half price.",
        deal: "Limited time deal",
      },
      {
        title: "Buy 1 Get 1 Free 👓",
        desc: "Most popular eyewear range included.",
        deal: "Most demanded offer!",
      },
      {
        title: "Blue Light Screen Protect Lenses",
        desc: "Perfect for laptop/mobile users.",
        deal: "Save your eyes + money",
      },
    ];
  
    return (
      <PageTemplate
        title="👓 Lenskart Eyewear Deals"
        subtitle="Stylish & protective glasses — budget friendly."
        offers={offers}
      />
    );
  }
  
  import PageTemplate from "@/app/components/PageTemplate";
  