import Link from "next/link";

export default function OfferPage({ params }: { params: { slug: string } }) {
  return (
    <main className="flex flex-col items-center py-16 text-white">
      <h1 className="text-4xl font-bold mb-4 text-[#16FF6E]">
        Offer: {params.slug}
      </h1>

      <p className="mt-4 opacity-80 max-w-lg text-center">
        This dynamic page is now valid and will fix Vercel build error 🚀
      </p>

      <Link href="/categories" className="neon-btn mt-8">
        ⬅ Back to Categories
      </Link>
    </main>
  );
}
