"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SaveContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const option = searchParams.get("option") || "";

  return (
    <div className="min-h-screen pt-28 px-6 text-white">
      <h1 className="text-3xl font-bold text-[#16FF6E] mb-6">
        {category.replace("-", " ")} → {option}
      </h1>

      <p className="text-gray-300 mb-8">
        You selected <strong>{option}</strong> in{" "}
        <strong>{category.replace("-", " ")}</strong>
      </p>

      <button
        className="px-6 py-3 bg-[#16FF6E] text-black rounded-xl hover:bg-white font-bold transition-all"
        onClick={() => alert("Saved Successfully!")}
      >
        Save Selection
      </button>
    </div>
  );
}

export default function SavePage() {
  return (
    <Suspense fallback={<p className="text-white p-10">Loading...</p>}>
      <SaveContent />
    </Suspense>
  );
}
