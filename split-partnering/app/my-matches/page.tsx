"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";
import { FaWhatsapp } from "react-icons/fa";

/* =========================
   TYPES
========================= */
type Match = {
  id: string;
  name: string;
  role: string;
  town: string;
  state: string;
  whatsapp: string;
  approved: boolean;
  status: "pending" | "ready";
};

export default function MyMatchesPage() {
  const router = useRouter();
  const { phoneLinked } = useAuth();

  /* =========================
     USER MATCH STATE
     (Later from Firebase)
  ========================= */
  const isFirstMatchVerified = phoneLinked; // 🔐 first match check
  const usedFreeMatches = 5; // 🔁 0–5 after verification

  /* =========================
     MATCH DATA (TEMP)
  ========================= */
  const matches: Match[] = [
    {
      id: "1",
      name: "Rahul Sharma",
      role: "Investor",
      town: "Bengaluru",
      state: "Karnataka",
      whatsapp: "919876543210",
      approved: true,
      status: "ready",
    },
    {
      id: "2",
      name: "Ananya Verma",
      role: "Co-Founder",
      town: "Chennai",
      state: "Tamil Nadu",
      whatsapp: "919812345678",
      approved: true,
      status: "ready",
    },
  ];

  /* =========================
     PROCEED LOGIC (FINAL)
  ========================= */
  const handleProceed = (match: Match) => {
    // Admin must approve & mark ready
    if (!match.approved || match.status !== "ready") {
      toast.error("Match is not ready yet ⏳");
      return;
    }

    // 🔐 FIRST MATCH → PHONE VERIFICATION REQUIRED
    if (!isFirstMatchVerified) {
      toast("Verify phone number to unlock free matches 📱");
      router.push("/verify-phone");
      return;
    }

    // 🎁 FREE MATCHES (0–5 AFTER VERIFICATION)
    if (usedFreeMatches < 5) {
      toast.success("Free match unlocked 🎉");
      router.push("/profile"); // or chat page
      return;
    }

    // 💳 PAYMENT REQUIRED AFTER FREE MATCHES
    router.push("/payment");
  };

  return (
    <div className="min-h-screen pt-28 px-6 text-white">
      <h1 className="text-3xl font-bold mb-4 text-center">My Matches</h1>

      {/* INFO BANNER */}
      <p className="text-center text-gray-400 mb-10">
        {isFirstMatchVerified ? (
          <>
            🎉 Promo active:{" "}
            <span className="text-gold-primary font-semibold">
              First 5 matches free
            </span>{" "}
            ({usedFreeMatches}/5 used)
          </>
        ) : (
          <>
            🔐 Phone verification required to unlock free matches
          </>
        )}
      </p>

      <div className="max-w-4xl mx-auto space-y-6">
        {matches.map((match) => (
          <div
            key={match.id}
            className="card-glass flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6"
          >
            {/* LEFT INFO */}
            <div>
              <h2 className="text-xl font-semibold">{match.name}</h2>
              <p className="text-sm text-gray-300">{match.role}</p>
              <p className="text-sm text-gray-400 mt-1">
                📍 {match.town}, {match.state}
              </p>
              <p className="text-xs mt-2">
                Status:{" "}
                <span
                  className={
                    match.status === "ready"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }
                >
                  {match.status}
                </span>
              </p>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-4">
              {/* WHATSAPP */}
              <a
                href={`https://wa.me/${match.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 text-3xl hover:scale-110 transition"
                title="Chat on WhatsApp"
              >
                <FaWhatsapp />
              </a>

              {/* PROCEED BUTTON */}
              <button
                onClick={() => handleProceed(match)}
                className="btn-primary text-sm"
              >
                {!isFirstMatchVerified
                  ? "Verify & Proceed"
                  : usedFreeMatches < 5
                  ? "Proceed (Free)"
                  : "Proceed to Payment"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
