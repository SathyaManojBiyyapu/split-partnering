"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { db } from "@/firebase/config";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  setDoc,
  getDoc,
} from "firebase/firestore";

/* -----------------------------------------
   GROUP SIZE
------------------------------------------*/
const GROUP_SIZE: Record<string, number> = {
  split: 2,
  pass: 2,
  supplements: 3,
  "peter-england": 2,
  "louis-philippe": 2,
  unlimited: 2,
  trends: 2,
  wrogn: 2,
  wildcraft: 2,
  zara: 2,
  hm: 2,
  nike: 2,
  adidas: 2,
  "save-ticket": 2,
  "bulk-ticket": 2,
  splitbuy: 2,
  "lens-split": 2,
  car: 4,
  bike: 2,
  "couple-entry": 2,
  "group-save": 4,
  "best-deals": 2,
  "gift-card": 2,
  room: 6,
  weekend: 4,
  java: 2,
  python: 2,
  c: 2,
  dsa: 2,
  oops: 2,
  cn: 2,
  dbms: 2,
  os: 2,
  "previous-papers": 2,
};

const getRequiredSize = (opt: string) => GROUP_SIZE[opt] || 2;

/* -----------------------------------------
   CREATE OR JOIN GROUP (FIXED)
------------------------------------------*/
async function createOrJoinGroup(category: string, option: string, rawPhone: string) {
  const cleanPhone = rawPhone.trim();

  const groupsRef = collection(db, "groups");

  // 🚀 FIX: Remove status filter → allow joining ANY unfilled group
  const q = query(
    groupsRef,
    where("category", "==", category),
    where("option", "==", option)
  );

  const snap = await getDocs(q);

  for (const gdoc of snap.docs) {
    const g = gdoc.data();
    const members: string[] = g.members || [];
    const required = g.requiredSize || getRequiredSize(option);

    // Already inside group
    if (members.includes(cleanPhone)) {
      return {
        status: "already",
        membersCount: members.length,
      };
    }

    // Join if space left
    if (members.length < required) {
      const gRef = doc(db, "groups", gdoc.id);

      await updateDoc(gRef, {
        members: arrayUnion(cleanPhone),
        membersCount: members.length + 1,
      });

      const updated = (await getDoc(gRef)).data() as any;
      const updatedMembers = updated.members || [];

      // Mark ready
      if (updatedMembers.length >= required) {
        await updateDoc(gRef, {
          status: "ready",
          readyAt: serverTimestamp(),
        });
      }

      return {
        status: "joined",
        membersCount: updatedMembers.length,
      };
    }
  }

  // Create a NEW group
  const newGroupRef = doc(groupsRef);
  const required = getRequiredSize(option);

  await setDoc(newGroupRef, {
    category,
    option,
    members: [cleanPhone],
    membersCount: 1,
    requiredSize: required,
    status: required === 1 ? "ready" : "waiting",
    createdAt: serverTimestamp(), // ALWAYS set createdAt
  });

  return {
    status: "created",
    membersCount: 1,
  };
}

/* -----------------------------------------
   SAVE CONTENT UI
------------------------------------------*/
function SaveContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get("category") || "";
  const option = searchParams.get("option") || "";

  const rawPhone =
    typeof window !== "undefined" ? localStorage.getItem("phone") : null;

  const phone: string | null = rawPhone ? rawPhone.trim() : null;

  const isGuest =
    typeof window !== "undefined"
      ? localStorage.getItem("guest") === "true"
      : false;

  const [userName, setUserName] = useState<string | null>(null);

  /* REQUIRE LOGIN */
  useEffect(() => {
    if (isGuest) {
      alert("Guest mode cannot save partner. Please login.");
      router.push("/login");
    }

    if (!phone) {
      router.push("/login");
    }
  }, [isGuest, phone, router]);

  /* LOAD USER NAME */
  useEffect(() => {
    if (!phone) return;

    const fetchUser = async () => {
      try {
        const userRef = doc(db, "users", phone);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          setUserName((snap.data() as any).name || null);
        }
      } catch (err) {
        console.error("Profile load error:", err);
      }
    };

    fetchUser();
  }, [phone]);

  /* SAVE PARTNER (FULLY FIXED) */
  const savePartner = async () => {
    if (!phone) return alert("Login required.");

    const cleanPhone = phone.trim();

    try {
      const result = await createOrJoinGroup(category, option, cleanPhone);

      // Ensure user exists
      const userRef = doc(db, "users", cleanPhone);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          phone: cleanPhone,
          name: userName || "User",
          createdAt: serverTimestamp(),
        });
      }

      // ALWAYS log selection (needed for multiple matches)
      await addDoc(collection(db, "selections"), {
        phone: cleanPhone,
        userName,
        category,
        option,
        createdAt: serverTimestamp(), // ALWAYS add createdAt
      });

      alert(
        `Partner saved!\n\nStatus: ${result.status}\nMembers: ${result.membersCount}/${getRequiredSize(
          option
        )}`
      );

      router.push("/categories");
    } catch (err) {
      console.error(err);
      alert("Saving failed.");
    }
  };

  return (
    <div className="min-h-screen pt-28 px-6 text-white">
      <h1 className="text-3xl font-bold text-[#16FF6E] mb-6">
        Make Your Match
      </h1>

      <p className="text-gray-300 mb-4">
        You selected <strong>{option}</strong> under{" "}
        <strong>{category.replace("-", " ")}</strong>
      </p>

      <button
        onClick={savePartner}
        className="px-6 py-3 bg-[#16FF6E] text-black rounded-xl hover:bg-white font-bold transition-all mt-4"
      >
        Save Partner
      </button>

      <button
        onClick={() => router.push("/categories")}
        className="mt-6 text-[#16FF6E] underline text-sm"
      >
        ← Back to Categories
      </button>
    </div>
  );
}

/* WRAPPER */
export default function SavePage() {
  return (
    <Suspense fallback={<p className="text-white p-10">Loading...</p>}>
      <SaveContent />
    </Suspense>
  );
}
