"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function DashboardPage() {
  const [latest, setLatest] = useState<any>(null);
  const [group, setGroup] = useState<any>(null);

  const phone = typeof window !== "undefined" ? localStorage.getItem("phone") : "";

  useEffect(() => {
    const fetch = async () => {
      if (!phone) return;

      const selectionsRef = collection(db, "selections");
      const q1 = query(selectionsRef, where("phone", "==", phone));
      const snap1 = await getDocs(q1);
      if (snap1.empty) return;

      const latestDoc = snap1.docs[snap1.docs.length - 1].data();
      setLatest(latestDoc);

      // find associated group (waiting/ready/completed)
      const groupsRef = collection(db, "groups");
      const q2 = query(
        groupsRef,
        where("category", "==", latestDoc.category),
        where("option", "==", latestDoc.option)
      );

      const snap2 = await getDocs(q2);

      // find the group that contains this phone (if any)
      const found = snap2.docs.map((d) => ({ id: d.id, ...d.data() })).find((g: any) => {
        const members: string[] = g.members || [];
        return members.includes(phone);
      });

      if (found) {
        setGroup(found);
      } else {
        // not yet in a group (possible if created later) — find any matching waiting group count
        if (snap2.empty) {
          setGroup(null);
        } else {
          // choose first match's counts (but user not in it)
          const first = snap2.docs[0].data();
          setGroup(first);
        }
      }
    };

    fetch();
  }, [phone]);

  return (
    <div className="pt-32 px-6 text-white">
      <h1 className="text-3xl font-bold text-[#16FF6E]">My Matches</h1>

      {!latest ? (
        <p className="text-gray-400 mt-4">No selections saved yet.</p>
      ) : (
        <>
          <p className="mt-4 text-gray-300">
            Latest selection:{" "}
            <span className="text-[#16FF6E] font-bold">
              {latest.category} → {latest.option}
            </span>
          </p>

          {!group ? (
            <p className="text-gray-400 mt-4">No group yet. Waiting for participants.</p>
          ) : (
            <div className="mt-6 p-4 bg-black/40 rounded-xl border border-[#16FF6E]/30">
              <p>
                <strong>Group Status:</strong>{" "}
                <span className={group.status === "ready" ? "text-green-400" : "text-yellow-400"}>
                  {group.status.toUpperCase()}
                </span>
              </p>

              <p className="mt-2">
                <strong>Progress:</strong> {group.membersCount} / {group.requiredSize}
              </p>

              {group.status === "ready" ? (
                <p className="text-gray-300 mt-4">
                  Your group is ready. The admin will contact you privately with next steps.
                </p>
              ) : (
                <p className="text-gray-300 mt-4">
                  Waiting for {group.requiredSize - group.membersCount} more to complete the group.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
