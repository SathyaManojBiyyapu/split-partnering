"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/firebase/config";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export default function ProfilePage() {
  const router = useRouter();
  const phone = typeof window !== "undefined" ? localStorage.getItem("phone") : null;

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  useEffect(() => {
    if (!phone) {
      // redirect to login if no phone
      router.push("/login");
      return;
    }

    // load profile if exists
    const load = async () => {
      try {
        const docRef = doc(db, "users", phone);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const d = snap.data();
          setInitialData(d);
          setName(d.name || "");
          setAge(d.age || "");
          setCity(d.city || "");
          setGender(d.gender || "");
          setEmail(d.email || "");
          setInterests(d.interests || "");
          setPreferredLocation(d.preferredLocation || "");
          setPreferredTime(d.preferredTime || "");
        }
      } catch (err) {
        console.error("Load profile error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [phone, router]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return alert("No phone found. Login again.");

    try {
      const docRef = doc(db, "users", phone);
      await setDoc(docRef, {
        name,
        age,
        city,
        gender,
        email,
        interests,
        preferredLocation,
        preferredTime,
        phone,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      alert("Profile saved!");
      // redirect to categories after profile saved
      router.push("/categories");
    } catch (err) {
      console.error("Save profile error:", err);
      alert("Failed to save profile");
    }
  };

  if (loading) {
    return <div className="pt-32 px-6 text-white">Loading profile...</div>;
  }

  return (
    <div className="pt-32 px-6 text-white max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-[#16FF6E] mb-4">Your Profile</h1>

      <form onSubmit={saveProfile} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300">Name</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} className="p-3 rounded w-full text-black" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300">Age</label>
            <input value={age} onChange={(e)=>setAge(e.target.value)} className="p-3 rounded w-full text-black" />
          </div>

          <div>
            <label className="block text-sm text-gray-300">Gender</label>
            <input value={gender} onChange={(e)=>setGender(e.target.value)} className="p-3 rounded w-full text-black" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300">City</label>
          <input value={city} onChange={(e)=>setCity(e.target.value)} className="p-3 rounded w-full text-black" />
        </div>

        <div>
          <label className="block text-sm text-gray-300">Email</label>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} className="p-3 rounded w-full text-black" />
        </div>

        <div>
          <label className="block text-sm text-gray-300">Interests (comma separated)</label>
          <input value={interests} onChange={(e)=>setInterests(e.target.value)} className="p-3 rounded w-full text-black" />
        </div>

        <div>
          <label className="block text-sm text-gray-300">Preferred meeting location</label>
          <input value={preferredLocation} onChange={(e)=>setPreferredLocation(e.target.value)} className="p-3 rounded w-full text-black" />
        </div>

        <div>
          <label className="block text-sm text-gray-300">Preferred meeting time</label>
          <input value={preferredTime} onChange={(e)=>setPreferredTime(e.target.value)} className="p-3 rounded w-full text-black" />
        </div>

        <div>
          <button className="px-6 py-3 bg-[#16FF6E] text-black rounded font-bold">Save Profile</button>
        </div>
      </form>
    </div>
  );
}
