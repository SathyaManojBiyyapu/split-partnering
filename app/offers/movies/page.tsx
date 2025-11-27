import PageTemplate from "@/components/PageTemplate";

export default function FashionOffers() {
  return (
    <PageTemplate
      title="Fashion Deals"
      subtitle="Split trendy purchases and save more."
      offers={[
        { title: "Zara", desc: "Flat 40% sale", deal: "Split plan ₹399 each" },
        { title: "H&M", desc: "Buy 2 Get 1 Free", deal: "Partner split plan" },
      ]}
    />
  );
}
