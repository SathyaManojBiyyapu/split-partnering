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
  status: string; // waiting | ready | completed
  createdAt?: any;
};

export default function DashboardPage() {
  const [latestSelection, setLatestSelection] =
    useState<{ category: string; option: string } | null>(null);

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  const phone =
    typeof window !== "undefined" ? localStorage.getItem("phone") : null;

  /* -----------------------------------------
     FETCH USER'S MOST RECENT SELECTION
  ------------------------------------------*/
  useEffect(() => {
    if (!phone) {
      setLoading(false);
      return;
    }

    const fetchSelection = async () => {
      try {
        const selRef = collection(db, "selections");
        const qSel = query(
          selRef,
          where("phone", "==", phone),
          orderBy("createdAt")
        );

        const snap = await getDocs(qSel);

        if (snap.empty) {
          setLatestSelection(null);
        } else {
          const lastDoc = snap.docs[snap.docs.length - 1].data() as DocumentData;

          setLatestSelection({
            category: lastDoc.category,
            option: lastDoc.option,
          });
        }
      } catch (err) {
        console.error("Error fetching selections:", err);
      }

      setLoading(false);
    };

    fetchSelection();
  }, [phone]);

  /* -----------------------------------------
     REAL-TIME GROUP LISTENER
  ------------------------------------------*/
  useEffect(() => {
    if (!latestSelection || !phone) return;

    const groupsRef = collection(db, "groups");

    const qGroups = query(
      groupsRef,
      where("category", "==", latestSelection.category),
      where("option", "==", latestSelection.option)
    );

    const unsubscribe = onSnapshot(
      qGroups,
      (snapshot) => {
        let match: Group | null = null;

        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          const members: string[] = data.members || [];

          if (members.includes(phone)) {
            match = {
              id: docSnap.id,
              category: data.category,
              option: data.option,
              membersCount: data.membersCount,
              requiredSize: data.requiredSize,
              status: data.status,
              createdAt: data.createdAt,
            };
          }
        });

        setGroup(match);
      },
      (err) => console.error("Group listener error:", err)
    );

    return () => unsubscribe();
  }, [latestSelection, phone]);

  /* -----------------------------------------
     UI: USER NOT LOGGED IN
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
     UI: LOADING
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
     UI: MAIN DASHBOARD
  ------------------------------------------*/
  return (
    <div className="pt-32 px-6 text-white">
      <h1 className="text-3xl font-bold text-[#16FF6E]">My Partners</h1>

      {/* USER HAS NO SAVED SELECTION */}
      {!latestSelection ? (
        <p className="text-gray-400 mt-4">
          You have not saved any partner yet. Go to Categories and start.
        </p>
      ) : (
        <>
          {/* LATEST SELECTION */}
          <p className="text-gray-300 mt-4">
            Latest selection:{" "}
            <span className="text-[#16FF6E] font-bold">
              {latestSelection.category.replace("-", " ")} →{" "}
              {latestSelection.option}
            </span>
          </p>

          {/* NO GROUP YET */}
          {!group ? (
            <p className="text-gray-400 mt-6">
              Waiting for partner group to be created…
            </p>
          ) : (
            <div className="mt-6 p-4 bg-black/40 rounded-xl border border-[#16FF6E]/30 max-w-xl">

              {/* STATUS */}
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    group.status === "ready"
                      ? "text-green-400"
                      : group.status === "completed"
                      ? "text-blue-400"
                      : "text-yellow-400"
                  }
                >
                  {group.status === "ready"
                    ? "Partner Found ✔"
                    : group.status === "completed"
                    ? "Completed"
                    : "Waiting for partners…"}
                </span>
              </p>

              {/* PROGRESS */}
              <p className="mt-2">
                <strong>Progress:</strong>{" "}
                <span className="text-[#16FF6E] font-bold">
                  {group.membersCount} / {group.requiredSize}
                </span>
              </p>

              {/* STATUS MESSAGE */}
              {group.status === "ready" ? (
                <p className="text-gray-300 mt-4">
                  Your partner group is ready. Admin will contact you soon.
                </p>
              ) : (
                <p className="text-gray-300 mt-4">
                  Waiting for{" "}
                  {group.requiredSize - group.membersCount} more partner
                  {group.requiredSize - group.membersCount > 1 ? "s" : ""}…
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
