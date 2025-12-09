"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
   GROUP SIZE LOGIC FOR EACH SUB-OPTION
------------------------------------------*/
const GROUP_SIZE: Record<string, number> = {
  // GYM
  split: 2,
  pass: 2,
  supplements: 3,

  // FASHION
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

  // MOVIES
  "save-ticket": 2,
  "bulk-ticket": 2,

  // LENSKART
  splitbuy: 2,
  "lens-split": 2,

  // LOCAL TRAVEL
  car: 4,
  bike: 2,

  // EVENTS
  "couple-entry": 2,
  "group-save": 4,

  // COUPONS
  "best-deals": 2,
  "gift-card": 2,

  // VILLAS
  room: 6,
  weekend: 4,

  // BOOKS
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

// fallback size = 2
const getRequiredSize = (opt: string) => GROUP_SIZE[opt] || 2;

/* -----------------------------------------
   CREATE OR JOIN GROUP
------------------------------------------*/
async function createOrJoinGroup(category: string, option: string, phone: string) {
  const groupsRef = collection(db, "groups");

  // find a waiting group
  const q = query(
    groupsRef,
    where("category", "==", category),
    where("option", "==", option),
    where("status", "==", "waiting")
  );

  const snap = await getDocs(q);

  for (const gdoc of snap.docs) {
    const g = gdoc.data();
    const members: string[] = g.members || [];
    const required = g.requiredSize || getRequiredSize(option);

    // already in this group
    if (members.includes(phone)) {
      return {
        status: "joined",
        groupId: gdoc.id,
        membersCount: members.length,
      };
    }

    // has space
    if (members.length < required) {
      const gRef = doc(db, "groups", gdoc.id);

      await updateDoc(gRef, {
        members: arrayUnion(phone),
        membersCount: members.length + 1,
      });

      const updated = (await getDoc(gRef)).data() as any;
      const updatedMembers = updated.members || [];

      // check if full
      if (updatedMembers.length >= required) {
        await updateDoc(gRef, {
          status: "ready",
          readyAt: serverTimestamp(),
        });
      }

      return {
        status: "joined",
        groupId: gdoc.id,
        membersCount: updatedMembers.length,
      };
    }
  }

  // create new group
  const newGroupRef = doc(groupsRef);
  const required = getRequiredSize(option);

  await setDoc(newGroupRef, {
    category,
    option,
    members: [phone],
    membersCount: 1,
    requiredSize: required,
    status: required === 1 ? "ready" : "waiting",
    createdAt: serverTimestamp(),
  });

  return { status: "created", groupId: newGroupRef.id, membersCount: 1 };
}

/* -----------------------------------------
   PAGE CONTENT
------------------------------------------*/
function SaveContent() {
  const searchParams = useSearchParams();

  const category = searchParams.get("category") || "";
  const option = searchParams.get("option") || "";

  const phone =
    typeof window !== "undefined"
      ? localStorage.getItem("phone") || "unknown"
      : "unknown";

  const [userName, setUserName] = useState<string | null>(null);

  // Load profile name
  useEffect(() => {
    const loadProfile = async () => {
      if (!phone) return;

      try {
        const userRef = doc(db, "users", phone);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          setUserName((snap.data() as any).name || null);
        }
      } catch (err) {
        console.error("Load profile error:", err);
      }
    };

    loadProfile();
  }, [phone]);

  /* -----------------------------------------
     SAVE PARTNER
  ------------------------------------------*/
  const savePartner = async () => {
    if (!phone || phone === "unknown")
      return alert("Please login with OTP first.");

    try {
      // save Selection
      await addDoc(collection(db, "selections"), {
        phone,
        userName,
        category,
        option,
        createdAt: serverTimestamp(),
      });

      // create/join group
      const result = await createOrJoinGroup(category, option, phone);

      alert(
        `Partner saved!  
Status: ${result.status}  
Partners: ${result.membersCount}/${getRequiredSize(option)}`
      );

      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Save error:", err);
      alert("Saving failed! Try again.");
    }
  };

  return (
    <div className="min-h-screen pt-28 px-6 text-white">
      <h1 className="text-3xl font-bold text-[#16FF6E] mb-6">
        {category.replace("-", " ").toUpperCase()} → {option.toUpperCase()}
      </h1>

      <p className="text-gray-300 mb-8">
        You selected <strong>{option}</strong> in{" "}
        <strong>{category.replace("-", " ")}</strong>
      </p>

      <button
        onClick={savePartner}
        className="px-6 py-3 bg-[#16FF6E] text-black rounded-xl hover:bg-white font-bold transition-all"
      >
        Save Partner
      </button>
    </div>
  );
}

/* -----------------------------------------
   EXPORT WRAPPER
------------------------------------------*/
export default function SavePage() {
  return (
    <Suspense fallback={<p className="text-white p-10">Loading...</p>}>
      <SaveContent />
    </Suspense>
  );
}
