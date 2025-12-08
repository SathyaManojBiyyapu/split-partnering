"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { db } from "@/firebase/config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [loadingProfile, setLoadingProfile] = useState(true);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user?.phoneNumber) {
      router.push("/login");
      return;
    }

    const load = async () => {
      const ref = doc(db, "users", user.phoneNumber);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const d: any = snap.data();
        setName(d.name || "");
        setAge(d.age || "");
        setCity(d.city || "");
        setGender(d.gender || "");
        setEmail(d.email || "");
        setInterests(d.interests || "");
      }

      setLoadingProfile(false);
    };

    load();
  }, [user, loading]);

  const saveProfile = async (e: any) => {
    e.preventDefault();

    await setDoc(
      doc(db, "users", user.phoneNumber),
      {
        name,
        age,
        city,
        gender,
        email,
        interests,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    alert("Profile saved!");
    router.push("/categories");
  };

  if (loading || loadingProfile)
    return <div className="pt-32 px-6 text-white">Loading profile...</div>;

  return (
    <div className="pt-32 px-6 text-white max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-[#16FF6E] mb-4">Your Profile</h1>
      <p className="mb-3 text-gray-300">
        Logged in as <b>{user?.phoneNumber}</b>
      </p>

      <form onSubmit={saveProfile} className="space-y-4">
        <input
          className="p-3 rounded w-full text-black"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            className="p-3 rounded w-full text-black"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <input
            className="p-3 rounded w-full text-black"
            placeholder="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />
        </div>

        <input
          className="p-3 rounded w-full text-black"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <input
          className="p-3 rounded w-full text-black"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="p-3 rounded w-full text-black"
          placeholder="Interests"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
        />

        <button className="px-6 py-3 bg-[#16FF6E] text-black rounded font-bold">
          Save Profile
        </button>
      </form>
    </div>
  );
}
