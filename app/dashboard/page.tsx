"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  doc,
  getDoc,
  orderBy,
  DocumentData,
} from "firebase/firestore";

export default function DashboardPage() {
  const [latestSelection, setLatestSelection] = useState<{ category: string; option: string } | null>(null);
  const [group, setGroup] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const phone = typeof window !== "undefined" ? localStorage.getItem("phone") : null;

  const showToast = (txt: string) => {
    setToast(txt);
    setTimeout(() => setToast(null), 6000);
  };

  useEffect(() => {
    if (!phone) {
      setLoading(false);
      return;
    }

    // load user profile name
    const loadProfile = async () => {
      try {
        const uref = doc(db, "users", phone);
        const snap = await getDoc(uref);
        if (snap.exists()) {
          setUserName((snap.data() as any).name || null);
        }
      } catch (err) {
        console.error("load profile:", err);
      }
    };

    // load latest selection
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

        const lastDoc = snap.docs[snap.docs.length - 1].data() as DocumentData;
        setLatestSelection({ category: lastDoc.category, option: lastDoc.option });
      } catch (err) {
        console.error("fetch latest selection:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
    fetchLatestSelection();
  }, [phone]);

  useEffect(() => {
    if (!latestSelection || !phone) {
      setGroup(null);
      return;
    }

    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("category", "==", latestSelection.category), where("option", "==", latestSelection.option));

    const unsub = onSnapshot(q, (snapshot) => {
      let found: any = null;

      snapshot.docs.forEach((d) => {
        const data = d.data() as any;
        const members: string[] = data.members || [];
        const g = { id: d.id, ...data };
        if (members.includes(phone)) {
          found = g;
        }
      });

      if (!found) {
        let first: any = null;
        snapshot.docs.forEach((d) => {
          const data = d.data() as any;
          const g = { id: d.id, ...data };
          if (!first) first = g;
          if (g.status === "waiting") first = g;
        });
        found = first;
      }

      // detect status change for toast
      if (group && found && group.status !== found.status) {
        if (found.status === "ready") {
          showToast("🎉 Your partner match is ready! Admin will contact you soon.");
        } else if (found.status === "completed") {
          showToast("✅ Your partner group is marked completed.");
        }
      }

      setGroup(found);
    }, (err) => console.error("group onSnapshot error:", err));

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestSelection, phone, group]);

  if (!phone) {
    return (
      <div className="pt-32 px-6 text-white">
        <h1 className="text-3xl font-bold text-[#16FF6E]">My Partners</h1>
        <p className="mt-4 text-gray-400">Please login with OTP to see your partner progress.</p>
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
    <div className="pt-32 px-6 text-white max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-[#16FF6E]">My Partners</h1>

      {userName && <p className="mt-2 text-gray-300">Hi, <span className="text-[#16FF6E] font-bold">{userName}</span></p>}

      {!latestSelection ? (
        <p className="text-gray-400 mt-6">You have not saved any partner selection yet.</p>
      ) : (
        <>
          <p className="text-gray-300 mt-4">Latest selection: <span className="text-[#16FF6E] font-bold">{latestSelection.category.replace("-", " ")} → {latestSelection.option}</span></p>

          {!group ? (
            <p className="text-gray-400 mt-6">No partner info available yet.</p>
          ) : (
            <div className="mt-6 p-4 bg-black/40 rounded-xl border border-[#16FF6E]/30">
              <p><strong>Partner Status:</strong> <span className={group.status === "ready" ? "text-green-400" : "text-yellow-400"}>{group.status === "ready" ? "Partner Found ✔" : "Waiting for your partner"}</span></p>

              <p className="mt-2"><strong>Partner progress:</strong> <span className="text-[#16FF6E] font-bold">{group.membersCount} / {group.requiredSize}</span></p>

              {group.status === "ready" ? (
                <p className="text-gray-300 mt-4">Your partner match is ready. Admin will contact you privately with next steps.</p>
              ) : (
                <p className="text-gray-300 mt-4">Waiting for {Math.max(0, group.requiredSize - group.membersCount)} more partner{group.requiredSize - group.membersCount > 1 ? "s" : ""}...</p>
              )}
            </div>
          )}
        </>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#16FF6E] text-black px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </div>
  );
}
