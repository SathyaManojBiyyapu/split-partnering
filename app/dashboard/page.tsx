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
  getDoc,
  doc,
  updateDoc,
  DocumentData,
  arrayRemove,
} from "firebase/firestore";

type Group = {
  id: string;
  category: string;
  option: string;
  members: string[];
  membersCount: number;
  requiredSize: number;
  status: string;
  createdAt?: any;
};

export default function DashboardPage() {
  const rawPhone =
    typeof window !== "undefined" ? localStorage.getItem("phone") : null;

  const phone = rawPhone ? rawPhone.trim() : null;

  const [latestSelection, setLatestSelection] =
    useState<{ category: string; option: string } | null>(null);

  const [matches, setMatches] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  /* -----------------------------------------
        FETCH LATEST SELECTION
  ------------------------------------------*/
  useEffect(() => {
    if (!phone) {
      setLoading(false);
      return;
    }

    const loadLast = async () => {
      try {
        const selRef = collection(db, "selections");
        const qSel = query(
          selRef,
          where("phone", "==", phone),
          orderBy("createdAt")
        );

        const snap = await getDocs(qSel);

        if (!snap.empty) {
          const last = snap.docs[snap.docs.length - 1].data() as DocumentData;

          setLatestSelection({
            category: last.category,
            option: last.option,
          });
        }
      } catch (err) {
        console.error("Selection fetch error:", err);
      }

      setLoading(false);
    };

    loadLast();
  }, [phone]);

  /* -----------------------------------------
        FETCH ALL GROUPS (LIVE)
  ------------------------------------------*/
  useEffect(() => {
    if (!phone) return;

    const groupsRef = collection(db, "groups");
    const qGroups = query(
      groupsRef,
      where("members", "array-contains", phone),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(qGroups, (snapshot) => {
      const list: Group[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;

        const membersClean = (data.members || []).map((p: string) =>
          p.trim()
        );

        list.push({
          id: docSnap.id,
          category: data.category,
          option: data.option,
          members: membersClean,
          membersCount: data.membersCount ?? membersClean.length,
          requiredSize: data.requiredSize,
          status: data.status,
          createdAt: data.createdAt,
        });
      });

      setMatches(list);
    });

    return () => unsub();
  }, [phone]);

  /* -----------------------------------------
        DELETE MATCH
  ------------------------------------------*/
  const deleteMatch = async (groupId: string) => {
    if (!confirm("Remove this match?")) return;
    if (!phone) return;

    try {
      const gRef = doc(db, "groups", groupId);
      const snap = await getDoc(gRef);
      const data = snap.data() as any;

      const currentCount =
        data?.membersCount ?? (data?.members?.length ?? 0);

      await updateDoc(gRef, {
        members: arrayRemove(phone),
        membersCount: Math.max(0, currentCount - 1),
      });

      alert("Match removed successfully");
    } catch (err) {
      console.error("Delete match error:", err);
      alert("Failed to remove match");
    }
  };

  /* -----------------------------------------
        NOT LOGGED IN
  ------------------------------------------*/
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

  /* -----------------------------------------
        LOADING
  ------------------------------------------*/
  if (loading) {
    return (
      <div className="pt-32 px-6 text-white">
        <h1 className="text-3xl font-bold text-[#16FF6E]">My Partners</h1>
        <p className="mt-4 text-gray-400">Loading...</p>
      </div>
    );
  }

  /* -----------------------------------------
        UI
  ------------------------------------------*/
  return (
    <div className="pt-32 px-6 text-white">
      <h1 className="text-3xl font-bold text-[#16FF6E]">My Partners</h1>

      {latestSelection && (
        <p className="text-gray-300 mt-4">
          Latest selection:{" "}
          <span className="text-[#16FF6E] font-bold">
            {latestSelection.category.replace("-", " ")} →
            {latestSelection.option}
          </span>
        </p>
      )}

      {matches.length === 0 ? (
        <p className="text-gray-400 mt-4">No partners saved yet.</p>
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
