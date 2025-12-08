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

const GROUP_SIZE: any = {
  split: 2,
  frame: 2,
  lens: 2,
  pass: 2,
  trainer: 1,
  supplements: 3,
  bundle: 2,
  season: 2,
  accessories: 2,
  cinema: 2,
  ott: 2,
  car: 4,
  bike: 2,
  cab: 3,
  concert: 2,
  workshop: 2,
  unused: 2,
  gift: 2,
  room: 6,
  weekend: 4,
  material: 2,
  notes: 2,
};

function getRequiredSize(option: string) {
  return GROUP_SIZE[option] || 2;
}

async function createOrJoinGroup(category: string, option: string, phone: string) {
  const groupsRef = collection(db, "groups");

  // find waiting groups
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

    // already in group
    if (members.includes(phone)) {
      return { status: "joined", groupId: gdoc.id, membersCount: members.length };
    }

    if (members.length < required) {
      const gRef = doc(db, "groups", gdoc.id);
      await updateDoc(gRef, {
        members: arrayUnion(phone),
        membersCount: (members.length || 0) + 1,
      });

      const updated = (await getDoc(gRef)).data() as any;
      const updatedMembers = updated.members || [];

      if ((updatedMembers.length || 0) >= required) {
        await updateDoc(gRef, { status: "ready", readyAt: serverTimestamp() });
      }

      return { status: "joined", groupId: gdoc.id, membersCount: updatedMembers.length };
    }
  }

  // create new group
  const newGroupRef = doc(groupsRef);
  const requiredSize = getRequiredSize(option);
  await setDoc(newGroupRef, {
    category,
    option,
    members: [phone],
    membersCount: 1,
    requiredSize,
    status: requiredSize === 1 ? "ready" : "waiting",
    createdAt: serverTimestamp(),
  });

  return { status: "created", groupId: newGroupRef.id, membersCount: 1 };
}

function SaveContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const option = searchParams.get("option") || "";

  const phone =
    typeof window !== "undefined" ? localStorage.getItem("phone") || "unknown" : "unknown";

  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!phone) return;
      try {
        const userRef = doc(db, "users", phone);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const d = snap.data() as any;
          setUserName(d.name || null);
        }
      } catch (err) {
        console.error("Load user profile error:", err);
      }
    };
    loadProfile();
  }, [phone]);

  const saveSelection = async () => {
    if (!phone || phone === "unknown") return alert("Please login first.");

    try {
      // save selection with userName if exists
      await addDoc(collection(db, "selections"), {
        phone,
        userName: userName || null,
        category,
        option,
        createdAt: serverTimestamp(),
      });

      // create/join group
      const res = await createOrJoinGroup(category, option, phone);

      // use partner wording
      alert(
        `Saved! Partner status: ${res.status}. Partners: ${res.membersCount}/${getRequiredSize(
          option
        )}`
      );

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Save Error:", error);
      alert("Saving failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen pt-28 px-6 text-white">
      <h1 className="text-3xl font-bold text-[#16FF6E] mb-6">
        {category.replace("-", " ").toUpperCase()} → {option.toUpperCase()}
      </h1>

      <p className="text-gray-300 mb-8">
        You selected <strong>{option}</strong> in <strong>{category.replace("-", " ")}</strong>
      </p>

      <button
        onClick={saveSelection}
        className="px-6 py-3 bg-[#16FF6E] text-black rounded-xl hover:bg-white transition-all font-bold"
      >
        Save Partner
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
