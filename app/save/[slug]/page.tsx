"use client";

export default function SavePage({ params, searchParams }: any) {
  const { slug } = params;
  const option = searchParams.option;

  return (
    <div className="min-h-screen pt-28 px-6 text-white">
      <h1 className="text-3xl font-bold text-[#16FF6E] mb-6">
        {slug.replace("-", " ")} → {option}
      </h1>

      <p className="text-gray-300 mb-8">
        You selected: <strong>{option}</strong>
      </p>

      <button
        className="
          px-6 py-3 bg-[#16FF6E] text-black rounded-xl 
          hover:bg-white font-bold transition-all
        "
        onClick={() => alert('Saved Successfully!')}
      >
        Save Selection
      </button>
    </div>
  );
}
