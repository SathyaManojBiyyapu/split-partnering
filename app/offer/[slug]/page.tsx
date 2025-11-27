import Link from "next/link";

export default function OfferPage({ params }: { params: { slug: string } }) {
  return (
    <main className="flex flex-col items-center py-16 text-white">
      <h1 className="text-4xl font-bold text-[#16F6FF]">
        Offer: {params.slug}
      </h1>

      <p className="mt-4 opacity-80 text-lg text-center max-w-lg">
        This is a dynamic offer page. You can customize content based on slug.
      </p>

      <Link href="/categories" className="neon-btn-outline mt-10">
        Back to Categories
      </Link>
    </main>
  );
}
