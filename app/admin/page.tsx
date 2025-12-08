"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";

export default function AdminPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const groupsRef = collection(db, "groups");
      const q = query(groupsRef, orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setGroups(list);
      setLoading(false);
    };
    fetch();
  }, []);

  const markCompleted = async (id: string) => {
    const gRef = doc(db, "groups", id);
    await updateDoc(gRef, { status: "completed" });
    setGroups((s) => s.map((g) => (g.id === id ? { ...g, status: "completed" } : g)));
  };

  const removeGroup = async (id: string) => {
    if (!confirm("Delete this group?")) return;
    await deleteDoc(doc(db, "groups", id));
    setGroups((s) => s.filter((g) => g.id !== id));
  };

  return (
    <div className="pt-32 px-6 text-white">
      <h1 className="text-3xl font-bold text-[#16FF6E]">Admin — Groups</h1>

      {loading ? (
        <p className="text-gray-400 mt-4">Loading...</p>
      ) : (
        <div className="mt-6 space-y-4">
          {groups.map((g) => (
            <div key={g.id} className="p-4 bg-black/40 rounded-xl border border-[#16FF6E]/30">
              <p>
                <strong>Category:</strong> {g.category} — <strong>Option:</strong> {g.option}
              </p>
              <p>
                <strong>Members ({g.membersCount}/{g.requiredSize}):</strong>
              </p>
              <ul className="mt-2 ml-4 list-disc">
                {(g.members || []).map((m: string, i: number) => (
                  <li key={i} className="text-sm">
                    {m}
                  </li>
                ))}
              </ul>

              <p className="mt-2">
                <strong>Status:</strong> {g.status}
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => markCompleted(g.id)}
                  className="px-3 py-1 bg-green-600 rounded"
                >
                  Mark Completed
                </button>
                <button onClick={() => removeGroup(g.id)} className="px-3 py-1 bg-red-600 rounded">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
