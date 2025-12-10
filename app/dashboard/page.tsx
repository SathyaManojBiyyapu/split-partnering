"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  doc,
  updateDoc,
  DocumentData,
} from "firebase/firestore";
import { arrayRemove } from "firebase/firestore";

type Group = {
  id: string;
  category: string;
  option: string;
  membersCount: number;
  requiredSize: number;
  status: string; // waiting | ready | completed
  createdAt?: any;
};

export default function DashboardPage() {
  const [latestSelection, setLatestSelection] =
    useState<{ category: string; option: string } | null>(null);

  const [matches, setMatches] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const phone =
    typeof window !== "undefined" ? localStorage.getItem("phone") : null;

  /* ------------------------------------------------
        FETCH USER'S MOST RECENT SELECTION
  ------------------------------------------------ */
  useEffect(() => {
    if (!phone) {
      setLoading(false);
      return;
    }

    const fetchLastSelection = async () => {
      try {
        const selRef = collection(db, "selections");
        const qSel = query(
          selRef,
          where("phone", "==", phone),
          orderBy("createdAt")
        );

        const snap = await getDocs(qSel);

        if (!snap.empty) {
          const lastDoc = snap.docs[snap.docs.length - 1].data() as DocumentData;

          setLatestSelection({
            category: lastDoc.category,
            option: lastDoc.option,
          });
        } else {
          setLatestSelection(null);
        }
      } catch (err) {
        console.error("Selection fetch error:", err);
      }

      setLoading(false);
    };

    fetchLastSelection();
  }, [phone]);

  /* ------------------------------------------------
        FETCH ALL GROUPS THE USER IS IN
  ------------------------------------------------ */
  useEffect(() => {
    if (!phone) return;

    const groupsRef = collection(db, "groups");
    const qGroups = query(
      groupsRef,
      where("members", "array-contains", phone),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(qGroups, (snapshot) => {
      let list: any[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          ...data,
        });
      });

      setMatches(list);
    });

    return () => unsubscribe();
  }, [phone]);

  /* ------------------------------------------------
        DELETE MATCH (remove user from group)
  ------------------------------------------------ */
  const deleteMatch = async (groupId: string) => {
    if (!confirm("Remove this match?")) return;
    if (!phone) return;

    try {
      const gRef = doc(db, "groups", groupId);
      await updateDoc(gRef, {
        members: arrayRemove(phone),
      });

      alert("Match removed successfully");
    } catch (err) {
      console.error("Delete match error:", err);
      alert("Failed to remove match");
    }
  };

  /* ------------------------------------------------
        1️⃣ USER NOT LOGGED IN
  ------------------------------------------------ */
  if (!phone) {
    return (
      <div className="pt-32 px-6 text-white">
        <h1 className="text-3xl font-bold text-[#16FF6E]">My Partners</h1>
        <p className="mt-4 text-gray-400">
          You are not logged in. Please login with OTP first.
        </p>
      </div>
    );
  }

  /* ------------------------------------------------
        2️⃣ LOADING
  ------------------------------------------------ */
  if (loading) {
    return (
      <div className="pt-32 px-6 text-white">
        <h1 className="text-3xl font-bold text-[#16FF6E]">My Partners</h1>
        <p className="mt-4 text-gray-400">Loading...</p>
      </div>
    );
  }

  /* ------------------------------------------------
        3️⃣ MAIN DASHBOARD
  ------------------------------------------------ */
  return (
    <div className="pt-32 px-6 text-white">
      <h1 className="text-3xl font-bold text-[#16FF6E]">My Partners</h1>

      {/* LATEST SELECTION (your old UI) */}
      {latestSelection && (
        <p className="text-gray-300 mt-4">
          Latest selection:{" "}
          <span className="text-[#16FF6E] font-bold">
            {latestSelection.category.replace("-", " ")} →{" "}
            {latestSelection.option}
          </span>
        </p>
      )}

      {/* NO MATCHES */}
      {matches.length === 0 ? (
        <p className="text-gray-400 mt-4">
          You have not saved any partner yet.
        </p>
      ) : (
        <div className="mt-8 space-y-4 max-w-xl">
          {matches.map((group) => (
            <div
              key={group.id}
              className="p-4 bg-black/40 rounded-xl border border-[#16FF6E]/30"
            >
              <p className="text-xl font-bold text-[#16FF6E] capitalize">
                {group.category.replace("-", " ")} → {group.option}
              </p>

              <p className="mt-1">
                Status:{" "}
                <span
                  className={
                    group.status === "ready"
                      ? "text-green-400"
                      : group.status === "completed"
                      ? "text-blue-400"
                      : "text-yellow-400"
                  }
                >
                  {group.status}
                </span>
              </p>

              <p className="mt-1 text-gray-300">
                Progress: {group.membersCount}/{group.requiredSize}
              </p>

              <button
                onClick={() => deleteMatch(group.id)}
                className="mt-3 px-3 py-2 bg-red-600 rounded text-sm"
              >
                Delete Match
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
