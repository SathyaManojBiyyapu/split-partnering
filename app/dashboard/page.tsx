"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  arrayRemove,
  DocumentData,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

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
  const router = useRouter();

  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [latestSelection, setLatestSelection] =
    useState<{ category: string; option: string } | null>(null);
  const [matches, setMatches] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [memberNames, setMemberNames] = useState<Record<string, string[]>>({});
  const [paidGroups, setPaidGroups] = useState<Record<string, boolean>>({});

  const town =
    typeof window !== "undefined" ? localStorage.getItem("town") : null;
  const state =
    typeof window !== "undefined" ? localStorage.getItem("state") : null;

  /* ---------------- AUTH LISTENER ---------------- */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (!user) setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* ---------------- FETCH LATEST SELECTION ---------------- */
  useEffect(() => {
    if (!firebaseUser) return;

    const loadLatest = async () => {
      try {
        const selRef = collection(db, "selections");
        const qSel = query(selRef, where("uid", "==", firebaseUser.uid));
        const snap = await getDocs(qSel);

        if (!snap.empty) {
          const sorted = snap.docs.sort(
            (a, b) =>
              (b.data().createdAt?.seconds || 0) -
              (a.data().createdAt?.seconds || 0)
          );

          const last = sorted[0].data() as DocumentData;

          setLatestSelection({
            category: last.category,
            option: last.option,
          });
        }
      } catch (err) {
        console.error("Latest selection error:", err);
      }

      setLoading(false);
    };

    loadLatest();
  }, [firebaseUser]);

  /* ---------------- FETCH GROUPS ---------------- */
  useEffect(() => {
    if (!firebaseUser) return;

    const groupsRef = collection(db, "groups");
    const qGroups = query(
      groupsRef,
      where("members", "array-contains", firebaseUser.uid)
    );

    const unsub = onSnapshot(qGroups, (snapshot) => {
      const list: Group[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;

        list.push({
          id: docSnap.id,
          category: data.category,
          option: data.option,
          members: data.members || [],
          membersCount:
            data.membersCount ?? (data.members ? data.members.length : 0),
          requiredSize: data.requiredSize,
          status: data.status,
          createdAt: data.createdAt,
        });
      });

      list.sort(
        (a, b) =>
          (b.createdAt?.seconds || 0) -
          (a.createdAt?.seconds || 0)
      );

      setMatches(list);
    });

    return () => unsub();
  }, [firebaseUser]);

  /* ---------------- CHECK PAYMENT STATUS ---------------- */
  useEffect(() => {
    if (!firebaseUser || matches.length === 0) return;

    const checkPayments = async () => {
      const paidMap: Record<string, boolean> = {};

      for (const group of matches) {
        const paymentsRef = collection(db, "payments");
        const qPay = query(
          paymentsRef,
          where("uid", "==", firebaseUser.uid),
          where("groupId", "==", group.id),
          where("status", "==", "paid")
        );

        const snap = await getDocs(qPay);
        paidMap[group.id] = !snap.empty;
      }

      setPaidGroups(paidMap);
    };

    checkPayments();
  }, [firebaseUser, matches]);

  /* ---------------- FETCH MEMBER NAMES ---------------- */
  useEffect(() => {
    if (!matches.length) return;

    const fetchNames = async () => {
      const namesMap: Record<string, string[]> = {};

      for (const group of matches) {
        const names: string[] = [];

        for (const uid of group.members) {
          try {
            const snap = await getDoc(doc(db, "users", uid));
            if (snap.exists()) {
              const fullName = snap.data().name || "Member";
              const parts = fullName.split(" ");
              const shortName =
                parts.length > 1
                  ? `${parts[0]} ${parts[1].charAt(0)}.`
                  : parts[0];
              names.push(shortName);
            }
          } catch {
            names.push("Member");
          }
        }

        namesMap[group.id] = names;
      }

      setMemberNames(namesMap);
    };

    fetchNames();
  }, [matches]);

  /* ---------------- DELETE MATCH ---------------- */
  const deleteMatch = async (groupId: string) => {
    if (!confirm("Remove this match?")) return;
    if (!firebaseUser) return;

    try {
      const gRef = doc(db, "groups", groupId);
      const snap = await getDoc(gRef);
      if (!snap.exists()) return;

      const data = snap.data() as any;
      const currentCount =
        data.membersCount ?? (data.members ? data.members.length : 0);
      const newCount = Math.max(0, currentCount - 1);

      await updateDoc(gRef, {
        members: arrayRemove(firebaseUser.uid),
        membersCount: newCount,
      });

      if (newCount === 0) {
        await deleteDoc(gRef);
      }

      alert("Match removed successfully");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to remove match");
    }
  };

  const handleProceed = (groupId: string) => {
    router.push(`/payment?groupId=${groupId}`);
  };

  const openChat = (groupId: string) => {
    router.push(`/chat/${groupId}`);
  };

  /* ---------------- UI ---------------- */

  if (!firebaseUser) {
    return (
      <div className="pt-32 px-6 max-w-5xl mx-auto">
        <h1 className="font-heading text-3xl text-gold-primary">
          Partner Sync
        </h1>
        <p className="mt-4 text-text-muted">
          Please login to view your synced groups.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-32 px-6 max-w-5xl mx-auto">
        <h1 className="font-heading text-3xl text-gold-primary">
          Partner Sync
        </h1>
        <p className="mt-4 text-text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="pt-32 px-6 max-w-5xl mx-auto">
      <h1 className="font-heading text-3xl text-gold-primary">
        Partner Sync
      </h1>

      {latestSelection && (
        <p className="text-text-muted mt-4">
          Latest selection:{" "}
          <span className="text-gold-primary font-semibold">
            {latestSelection.category.replace("-", " ")} →{" "}
            {latestSelection.option}
          </span>
        </p>
      )}

      {matches.length === 0 ? (
        <p className="text-text-muted mt-6">
          No partner sync groups yet.
        </p>
      ) : (
        <div className="mt-10 space-y-5">
          {matches.map((group) => {
            const isPaid = paidGroups[group.id] || false;

            return (
              <div
                key={group.id}
                className="relative rounded-2xl p-5 bg-black/40 border border-dark-card"
              >
                {!isPaid ? (
                  <button
                    onClick={() => handleProceed(group.id)}
                    className="absolute top-4 right-4 px-4 py-1 text-xs font-semibold bg-gold-primary text-black rounded-full"
                  >
                    Unlock Coordination – ₹29
                  </button>
                ) : group.status === "completed" ? (
                  <div className="absolute top-4 right-4 flex items-center gap-3">
                    <span className="text-green-400 text-xs font-semibold">
                      🎉 Completed
                    </span>
                    <button
                      onClick={() => openChat(group.id)}
                      className="px-4 py-1 text-xs font-semibold bg-green-500 text-black rounded-full hover:bg-green-400 transition"
                    >
                      Enter Chat
                    </button>
                  </div>
                ) : group.status === "ready" ? (
                  <div className="absolute top-4 right-4 text-green-400 text-xs font-semibold">
                    ✅ Activated – Waiting for others
                  </div>
                ) : (
                  <div className="absolute top-4 right-4 text-yellow-400 text-xs font-semibold">
                    ⏳ Waiting for group to fill...
                  </div>
                )}

                <p className="font-heading text-lg text-gold-primary capitalize">
                  {group.category.replace("-", " ")} → {group.option}
                </p>

                <div className="mt-2 text-sm text-text-body">
                  🔄 {group.membersCount}/{group.requiredSize} Members Synced
                  {group.requiredSize - group.membersCount === 1 && (
                    <div className="text-xs mt-1 text-red-400 font-semibold">
                      ⚡ Only 1 slot left!
                    </div>
                  )}
                </div>

                {memberNames[group.id] && (
                  <div className="mt-3 text-sm text-text-muted space-y-1">
                    {memberNames[group.id].map((name, index) => (
                      <p key={index}>• {name}</p>
                    ))}

                    {!isPaid && (
                      <p className="text-xs mt-2 text-yellow-400">
                        🔒 Full coordination unlocks after activation
                      </p>
                    )}
                  </div>
                )}

                {town && state && (
                  <p className="mt-2 text-xs text-text-muted">
                    📍 {town}, {state}
                  </p>
                )}

                <button
                  onClick={() => deleteMatch(group.id)}
                  className="mt-4 px-4 py-2 text-xs font-medium rounded-full border border-red-500/40 text-red-400 hover:bg-red-600/20 transition"
                >
                  Leave Group
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}