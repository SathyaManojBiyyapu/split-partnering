"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OptionsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to categories after a brief moment
    const timer = setTimeout(() => {
      router.push("/categories");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen pt-32 px-6 text-white text-center">
      <h1 className="text-3xl font-bold text-[#16FF6E] mb-4">Options</h1>
      <p className="text-gray-400 mb-6">Redirecting to categories...</p>
      <Link href="/categories" className="text-[#16FF6E] underline">
        Go to Categories →
      </Link>
    </div>
  );
}


