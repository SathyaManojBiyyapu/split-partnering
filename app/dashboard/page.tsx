"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  orderBy,
  DocumentData,
} from "firebase/firestore";

type Group = {
  id: string;
  category: string;
  option: string;
  membersCount: number;
  requiredSize: number;
  status: string; // "waiting" | "ready" | "completed"
  createdAt?: any;
};

export default function DashboardPage() {
  const [latestSelection, setLatestSelection] = useState<{ category: string; option: string } | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  // read phone from localStorage (set on successful OTP)
  const phone = typeof window !== "undefined" ? localStorage.getItem("phone") : null;

  useEffect(() => {
    if (!phone) {
      setLoading(false);
      return;
    }

    // 1) fetch user's last selection from 'selections' collection
    const fetchLatestSelection = async () => {
      try {
        const selRef = collection(db, "selections");
        const q = query(selRef, where("phone", "==", phone), orderBy("createdAt"));
        const snap = await getDocs(q);

        if (snap.empty) {
          setLatestSelection(null);
          setLoading(false);
          return;
        }

        // pick the last doc as latest (ordered by createdAt)
        const lastDoc = snap.docs[snap.docs.length - 1].data() as DocumentData;
        setLatestSelection({ category: lastDoc.category, option: lastDoc.option });
      } catch (err) {
        console.error("Failed to fetch selections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestSelection();
  }, [phone]);

  useEffect(() => {
    if (!latestSelection || !phone) {
      setGroup(null);
      return;
    }

    // 2) Listen in real-time for the group that contains this phone OR any matching groups
    const groupsRef = collection(db, "groups");
    const q = query(
      groupsRef,
      where("category", "==", latestSelection.category),
      where("option", "==", latestSelection.option)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // find group that contains the user's phone (if any)
        let found: Group | null = null;

        snapshot.docs.forEach((d) => {
          const data = d.data() as any;
          const members: string[] = data.members || [];
          const g: Group = {
            id: d.id,
            category: data.category,
            option: data.option,
            membersCount: data.membersCount || (members.length || 0),
            requiredSize: data.requiredSize || 2,
            status: data.status || "waiting",
            createdAt: data.createdAt,
          };

          if (members.includes(phone)) {
            found = g;
          }
        });

        // If user is not yet in a group, pick first waiting/ready group to show progress (optional)
        if (!found) {
          // prefer waiting group if exists, else any
          let first: Group | null = null;
          snapshot.docs.forEach((d) => {
            const data = d.data() as any;
            const members: string[] = data.members || [];
            const g: Group = {
              id: d.id,
              category: data.category,
              option: data.option,
              membersCount: data.membersCount || (members.length || 0),
              requiredSize: data.requiredSize || 2,
              status: data.status || "waiting",
              createdAt: data.createdAt,
            };
            if (!first) first = g;
            // prioritize waiting groups
            if (g.status === "waiting") first = g;
          });
          found = first;
        }

        setGroup(found);
      },
      (err) => {
        console.error("Group listener error:", err);
      }
    );

    return () => unsubscribe();
  }, [latestSelection, phone]);

  if (!phone) {
    return (
      <div className="pt-32 px-6 text-white">
        <h1 className="text-3xl font-bold text-[#16FF6E]">My Partners</h1>
        <p className="mt-4 text-gray-400">You are not logged in. Please login with OTP to see your partner progress.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-32 px-6 text-white">
        <h1 className="text-3xl font-bold text-[#16FF6E]">My Partners</h1>
        <p className="mt-4 text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="pt-32 px-6 text-white">
      <h1 className="text-3xl font-bold text-[#16FF6E]">My Partners</h1>

      {!latestSelection ? (
        <p className="text-gray-400 mt-4">You have not saved any partner selection yet. Go to Categories and save a partner.</p>
      ) : (
        <>
          <p className="text-gray-300 mt-4">
            Latest selection:{" "}
            <span className="text-[#16FF6E] font-bold">
              {latestSelection.category.replace("-", " ")} → {latestSelection.option}
            </span>
          </p>

          {!group ? (
            <p className="text-gray-400 mt-6">No partner info available yet.</p>
          ) : (
            <div className="mt-6 p-4 bg-black/40 rounded-xl border border-[#16FF6E]/30 max-w-xl">
              <p>
                <strong>Partner Status:</strong>{" "}
                <span className={group.status === "ready" ? "text-green-400" : "text-yellow-400"}>
                  {group.status === "ready" ? "Partner Found ✔" : "Waiting for your partner"}
                </span>
              </p>

              <p className="mt-2">
                <strong>Partner progress:</strong>{" "}
                <span className="text-[#16FF6E] font-bold">
                  {group.membersCount} / {group.requiredSize}
                </span>
              </p>

              {group.status === "ready" ? (
                <p className="text-gray-300 mt-4">
                  Your partner match is ready. Admin will contact you privately with next steps.
                </p>
              ) : (
                <p className="text-gray-300 mt-4">
                  Waiting for {Math.max(0, group.requiredSize - group.membersCount)} more partner
                  {group.requiredSize - group.membersCount > 1 ? "s" : ""}...
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
