"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "Hari@2307";

/* ================= UTIL ================= */

const formatDateTime = (ts: any) => {
  if (!ts?.seconds) return "N/A";
  const d = new Date(ts.seconds * 1000);
  return `${d.toLocaleDateString()} · ${d.toLocaleTimeString()}`;
};

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= AUTO LOGIN ================= */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("isAdmin") === "true") {
      setAuthorized(true);
    }
  }, []);

  /* ================= FETCH GROUPS ================= */
  useEffect(() => {
    if (!authorized) return;

    setLoading(true);
    const ref = collection(db, "groups");

    const unsubscribe = onSnapshot(ref, async (snap) => {
      const docs = snap.docs;

      const builtGroups = await Promise.all(
        docs.map(async (gDoc) => {
          const data = gDoc.data() as any;

          // AUTO DELETE EMPTY GROUPS
          if (!Array.isArray(data.members) || data.members.length === 0) {
            await deleteDoc(gDoc.ref);
            return null;
          }

          const cleanedMembers = data.members.map((m: any) =>
            typeof m === "string"
              ? { phone: m.trim(), joinedAt: data.createdAt }
              : m
          );

          const userDocs = await Promise.all(
            cleanedMembers.map((m: any) =>
              getDoc(doc(db, "users", m.phone))
            )
          );

          const membersDetailed = userDocs.map((uSnap, idx) => ({
            phone: cleanedMembers[idx].phone,
            joinedAt: cleanedMembers[idx].joinedAt,
            name: uSnap.exists()
              ? ((uSnap.data() as any)?.name ?? "Unknown User")
              : "Unknown User",
          }));

          return {
            id: gDoc.id,
            ...data,
            members: cleanedMembers,
            membersDetailed,
            membersCount:
              typeof data.membersCount === "number"
                ? data.membersCount
                : cleanedMembers.length,
            lastActivityAt: data.lastActivityAt ?? data.createdAt,
          };
        })
      );

      const list = builtGroups.filter(Boolean);

      list.sort((a: any, b: any) => {
        const ta = a.lastActivityAt?.seconds || 0;
        const tb = b.lastActivityAt?.seconds || 0;
        return tb - ta;
      });

      setGroups(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authorized]);

  /* ================= LOGIN ================= */
  const loginAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
      localStorage.setItem("isAdmin", "true");
      setAuthorized(true);
    } else {
      alert("❌ Wrong username or password");
    }
  };

  /* ================= LOGOUT ================= */
  const adminLogout = () => {
    localStorage.removeItem("isAdmin");
    setAuthorized(false);
  };

  /* ================= STATUS ACTIONS ================= */

  // 🔥 NEW: MARK READY (USER CAN PROCEED)
  const markReady = async (id: string) => {
    await updateDoc(doc(db, "groups", id), {
      status: "ready",
      lastActivityAt: new Date(),
    });
  };

  // EXISTING: MARK COMPLETED
  const markCompleted = async (id: string) => {
    await updateDoc(doc(db, "groups", id), {
      status: "completed",
      lastActivityAt: new Date(),
    });
  };

  // DELETE GROUP
  const deleteGroup = async (id: string) => {
    if (!confirm("Delete this group?")) return;
    await deleteDoc(doc(db, "groups", id));
  };

  /* ================= LOGIN UI ================= */
  if (!authorized) {
    return (
      <div className="pt-32 text-white flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gold-primary">Admin Login</h1>
        <form className="mt-6 w-72 space-y-4" onSubmit={loginAdmin}>
          <input
            className="input"
            placeholder="Username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
          />
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <button className="btn-primary w-full">Login</button>
        </form>
      </div>
    );
  }

  /* ================= DASHBOARD UI ================= */
  return (
    <div className="pt-28 px-6 bg-black text-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading text-gold-primary">
          Admin · Partner Groups
        </h1>
        <button onClick={adminLogout} className="btn-outline text-sm">
          Logout
        </button>
      </div>

      {loading ? (
        <p className="text-text-muted">Loading groups…</p>
      ) : (
        <div className="space-y-6">
          {groups.map((g) => (
            <div
              key={g.id}
              className="card-glass p-6 rounded-2xl"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xl font-heading text-gold-primary">
                    {g.category} → {g.option}
                  </p>
                  <p className="text-sm text-text-muted">
                    {g.membersCount}/{g.requiredSize} members
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {formatDateTime(g.createdAt)}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold ${
                    g.status === "completed"
                      ? "bg-green-600"
                      : g.status === "ready"
                      ? "bg-blue-600"
                      : "bg-yellow-500 text-black"
                  }`}
                >
                  {g.status ?? "waiting"}
                </span>
              </div>

              {/* MEMBERS */}
              <div className="mt-4 space-y-2">
                {g.membersDetailed.map((m: any, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-black/40 p-3 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-semibold">👤 {m.name}</p>
                      <p className="text-xs text-gray-400">📞 {m.phone}</p>
                    </div>

                    <button
                      onClick={() =>
                        window.open(
                          `https://wa.me/91${m.phone}?text=${encodeURIComponent(
                            "Hello! Your PartnerSync group is ready."
                          )}`
                        )
                      }
                      className="text-green-400 text-lg"
                    >
                      🟢
                    </button>
                  </div>
                ))}
              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={() => markReady(g.id)}
                  className="bg-blue-600 px-4 py-1 rounded text-sm"
                >
                  Mark Ready
                </button>

                <button
                  onClick={() => markCompleted(g.id)}
                  className="bg-green-600 px-4 py-1 rounded text-sm"
                >
                  Mark Completed
                </button>

                <button
                  onClick={() => deleteGroup(g.id)}
                  className="bg-red-600 px-4 py-1 rounded text-sm"
                >
                  Delete Group
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
