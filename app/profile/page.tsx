"use client";

import { useState, useEffect } from "react";
import { db } from "@/firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(true);

  const phone =
    typeof window !== "undefined" ? localStorage.getItem("phone") : null;

  // Fetch existing profile data
  useEffect(() => {
    if (!phone) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      const userRef = doc(db, "users", phone);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        setName(data.name || "");
        setCity(data.city || "");
        setState(data.state || "");
        setCountry(data.country || "");
      }

      setLoading(false);
    };

    fetchProfile();
  }, [phone]);

  // Save profile
  const saveProfile = async () => {
    if (!phone) return alert("Login again, phone missing.");

    const userRef = doc(db, "users", phone);

    await setDoc(
      userRef,
      {
        phone,
        name,
        city,
        state,
        country,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    alert("Profile saved successfully!");
    window.location.href = "/categories";
  };

  if (!phone) {
    return (
      <div className="pt-32 px-6 text-white">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="mt-3 text-gray-300">
          Please login first to update your profile.
        </p>
      </div>
    );
  }

  if (loading)
    return (
      <div className="pt-32 px-6 text-white">Loading Profile...</div>
    );

  return (
    <div className="text-white pt-32 flex flex-col items-center gap-5 px-6">
      <h1 className="text-3xl font-bold text-[#16FF6E]">Your Profile</h1>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-3 rounded text-black w-72"
      />

      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="p-3 rounded text-black w-72"
      />

      <input
        type="text"
        placeholder="State"
        value={state}
        onChange={(e) => setState(e.target.value)}
        className="p-3 rounded text-black w-72"
      />

      <input
        type="text"
        placeholder="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="p-3 rounded text-black w-72"
      />

      <button
        onClick={saveProfile}
        className="bg-[#16FF6E] text-black px-6 py-3 rounded-xl font-bold"
      >
        Save Profile
      </button>
    </div>
  );
}
