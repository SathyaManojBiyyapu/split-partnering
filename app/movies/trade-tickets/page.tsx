"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/firebase/config";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

export default function TradeTicketPage() {
  const router = useRouter();

  /* 🔐 LOGIN CHECK */
  const phone =
    typeof window !== "undefined"
      ? localStorage.getItem("phone")
      : null;

  useEffect(() => {
    if (!phone) {
      alert("Please login to trade tickets");
      router.push("/login");
    }
  }, [phone, router]);

  /* FORM STATE */
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [theatre, setTheatre] = useState("");
  const [movie, setMovie] = useState("");
  const [showDate, setShowDate] = useState("");
  const [showTime, setShowTime] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  /* SUBMIT */
  const handleSubmit = async () => {
    if (
      !state ||
      !city ||
      !theatre ||
      !movie ||
      !showDate ||
      !showTime ||
      quantity < 1
    ) {
      return alert("Please fill all fields");
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "movieTickets"), {
        sellerPhone: phone,
        state,
        city,
        theatre,
        movie,
        showDate,
        showTime,
        quantity,
        status: "available",
        createdAt: serverTimestamp(),
      });

      alert("Ticket listed successfully!");
      router.push("/movies/available-tickets");
    } catch (err) {
      console.error(err);
      alert("Failed to save ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-6 bg-black text-[#F5F5F5]">
      <h1 className="text-3xl font-semibold text-[#FFD166] mb-2">
        Trade Movie Tickets
      </h1>

      <p className="text-gray-400 mb-8 text-sm">
        Enter ticket details to make them available
      </p>

      {/* FORM */}
      <div className="max-w-xl space-y-4">
        <input
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full neon-input"
        />

        <input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full neon-input"
        />

        <input
          placeholder="Theatre Name"
          value={theatre}
          onChange={(e) => setTheatre(e.target.value)}
          className="w-full neon-input"
        />

        <input
          placeholder="Movie Name"
          value={movie}
          onChange={(e) => setMovie(e.target.value)}
          className="w-full neon-input"
        />

        <input
          type="date"
          value={showDate}
          onChange={(e) => setShowDate(e.target.value)}
          className="w-full neon-input"
        />

        <input
          type="time"
          value={showTime}
          onChange={(e) => setShowTime(e.target.value)}
          className="w-full neon-input"
        />

        <input
          type="number"
          min={1}
          placeholder="Ticket Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full neon-input"
        />

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="
            w-full mt-4 px-6 py-3 rounded-xl font-semibold
            bg-black text-[#E6C972]
            border border-[#E6C972]
            shadow-[0_0_18px_rgba(230,201,114,0.75)]
            hover:bg-[#F3DC8A]
            hover:text-black
            transition
          "
        >
          {loading ? "Saving..." : "List Tickets"}
        </button>

        {/* BACK */}
        <button
          onClick={() => router.push("/categories")}
          className="block text-[#FFD166] text-sm mt-4 hover:underline"
        >
          ← Back to Categories
        </button>
      </div>
    </div>
  );
}
