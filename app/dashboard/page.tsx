"use client";

export default function Dashboard() {
  // Dummy data for now — later you can replace with DB
  const savedPartners = [
    { name: "Ravi", offer: "Lenskart Gold", status: "Pending" },
    { name: "Sneha", offer: "Amazon Prime", status: "Matched" },
    { name: "Aarav", offer: "Cult Fit", status: "Pending" },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 py-16 text-white">
      
      {/* Header Section */}
      <h1 className="text-3xl font-bold text-[#16FF6E]">My Matches 🤝</h1>
      <p className="text-gray-300 text-sm mt-1 mb-10">
        Here are your current partner requests & match status.
      </p>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {savedPartners.map((user, i) => (
          <div
            key={i}
            className="bg-black/60 border border-[#16FF6E]/40 p-5 rounded-xl hover:border-[#16FF6E] transition"
          >
            <h2 className="text-lg font-semibold text-[#16FF6E]">{user.offer}</h2>
            <p className="opacity-90 text-sm mt-1">Partner: {user.name}</p>
            <p
              className={`mt-2 text-xs font-semibold ${
                user.status === "Matched"
                  ? "text-[#16FF6E]"
                  : "text-yellow-300 animate-pulse"
              }`}
            >
              Status: {user.status}
            </p>
          </div>
        ))}
      </div>

      {/* Explore More Button */}
      <div className="text-center mt-12">
        <a
          href="/categories"
          className="bg-[#16FF6E] text-black px-6 py-2 rounded-full font-medium shadow-[0_0_20px_#16FF6E] hover:shadow-[0_0_40px_#16FF6E] transition"
        >
          Explore More Offers 🚀
        </a>
      </div>
    </main>
  );
}
