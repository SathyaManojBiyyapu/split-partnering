"use client";

const categoryOptions: Record<string, { name: string; slug: string }[]> = {
  gym: [
    { name: "Partner & Save", slug: "split" },
    { name: "GNC", slug: "supplements-gnc" },
    { name: "Herbalife", slug: "supplements-herbalife" },
    { name: "Muscletech", slug: "supplements-muscletech" },
    { name: "Optimum Nutrition", slug: "supplements-optimum" },
    { name: "Big Muscles", slug: "supplements-bigmuscles" },
  ],

  fashion: [
    { name: "Peter England", slug: "peter-england" },
    { name: "Louis Philippe", slug: "louis-philippe" },
    { name: "Unlimited", slug: "unlimited" },
    { name: "Trends", slug: "trends" },
    { name: "Wrogn", slug: "wrogn" },
    { name: "Wildcraft", slug: "wildcraft" },
    { name: "Zara", slug: "zara" },
    { name: "H&M", slug: "hm" },
    { name: "Nike", slug: "nike" },
    { name: "Adidas", slug: "adidas" },
  ],

  movies: [
    { name: "Save Ticket", slug: "save-ticket" },
    { name: "Save Bulk Tickets", slug: "bulk-ticket" },
  ],

  lenskart: [
    { name: "Split & Buy", slug: "split" },
    { name: "Lens Split", slug: "lens-split" },
  ],

  "local-travel": [
    { name: "Car Partner", slug: "car" },
    { name: "Bike Partner", slug: "bike" },
  ],

  events: [
    { name: "Couple Entry", slug: "couple-entry" },
    { name: "Group & Save", slug: "group-save" },
  ],

  coupons: [
    { name: "Best Deals", slug: "best-deals" },
    { name: "Gift Card", slug: "gift-card" },
  ],

  villas: [
    { name: "Group, Split & Save", slug: "room" },
    { name: "Weekend Villa", slug: "weekend" },
  ],

  books: [
    { name: "Java Unlock", slug: "java" },
    { name: "Python Unlock", slug: "python" },
    { name: "C Unlock", slug: "c" },
    { name: "DSA Unlock", slug: "dsa" },
    { name: "OOPS Unlock", slug: "oops" },
    { name: "CN Unlock", slug: "cn" },
    { name: "DBMS Unlock", slug: "dbms" },
    { name: "OS Unlock", slug: "os" },
    { name: "Previous Papers", slug: "previous-papers" },
  ],
};

export default function OptionsPage({ params }: any) {
  const slug: string = params?.slug || "";

  const options = categoryOptions[slug] || [];

  // If slug is invalid -> show not found message
  const title =
    slug && categoryOptions[slug]
      ? slug.replace("-", " ").toUpperCase()
      : "CATEGORY NOT FOUND";

  return (
    <div className="min-h-screen pt-28 px-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-[#16FF6E]">{title}</h1>

      {options.length === 0 ? (
        <p className="text-gray-400 mt-10">No options available.</p>
      ) : (
        <div className="grid gap-4">
          {options.map((item) => (
            <a
              key={item.slug}
              href={`/save/?category=${slug}&option=${item.slug}`}
              className="p-5 rounded-xl border border-[#16FF6E]/40 bg-black/40 hover:bg-black/70 transition"
            >
              <h2 className="text-xl">{item.name}</h2>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
