"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

// --- ADMIN CREDENTIALS ---
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "Hari@2307";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // AUTO LOGIN IF ALREADY LOGGED BEFORE
  useEffect(() => {
    if (localStorage.getItem("isAdmin") === "true") {
      setAuthorized(true);
    }
  }, []);

  // REAL-TIME GROUP LISTENER
  useEffect(() => {
    if (!authorized) return;

    setLoading(true);
    const ref = collection(db, "groups");
    const q = query(ref, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, async (snap) => {
      const list: any[] = [];

      for (const g of snap.docs) {
        const data = g.data();

        // Fetch member user details
        let membersDetailed: any[] = [];

        for (const phone of data.members || []) {
          const userRef = doc(db, "users", phone);
          const userSnap = await getDoc(userRef);

          membersDetailed.push({
            phone,
            name: userSnap.exists() ? userSnap.data().name : "Unknown User",
          });
        }

        list.push({ id: g.id, ...data, membersDetailed });
      }

      setGroups(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authorized]);

  // --- LOGIN ---
  const loginAdmin = (e: any) => {
    e.preventDefault();

    if (usernameInput === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
      setAuthorized(true);
      localStorage.setItem("isAdmin", "true");
    } else {
      alert("❌ Wrong username or password");
    }
  };

  // --- MARK COMPLETED ---
  const markCompleted = async (groupId: string) => {
    await updateDoc(doc(db, "groups", groupId), { status: "completed" });
    alert("✔ Group marked completed");
  };

  // --- DELETE GROUP ---
  const deleteGroup = async (groupId: string) => {
    if (!confirm("Delete this partner group?")) return;
    await deleteDoc(doc(db, "groups", groupId));
    alert("❌ Group deleted");
  };

  // --- EXPORT CSV ---
  const exportCSV = (group: any) => {
    const csv = (group.members || []).join(",");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  // --- CONTACT ALL MEMBERS (WHATSAPP MASS MESSAGE) ---
  const contactAll = (g: any) => {
    if (!g.members?.length) return alert("No numbers available");

    const msg =
      `👋 *Split Partnering Update*\n\n` +
      `Your partner group for *${g.category} → ${g.option}* is now *${g.status.toUpperCase()}*.\n\n` +
      `Group Members: ${g.membersCount}/${g.requiredSize}\n\n` +
      `Admin will guide you shortly.`;

    const encoded = encodeURIComponent(msg);

    g.members.forEach((p: string) => {
      const clean = p.replace("+", "");
      window.open(`https://wa.me/${clean}?text=${encoded}`, "_blank");
    });
  };

  // --- CONTACT INDIVIDUAL MEMBER ---
  const contactOne = (g: any) => {
    if (!g.members?.length) return alert("No members");

    const choice = prompt(`Enter phone number to contact:\n\n${g.members.join("\n")}`);
    if (!choice) return;

    if (!g.members.includes(choice)) {
      alert("Number not found in group");
      return;
    }

    const msg = `Hello! Your partner group for ${g.category} → ${g.option} is active.`;
    const encoded = encodeURIComponent(msg);
    const clean = choice.replace("+", "");

    window.open(`https://wa.me/${clean}?text=${encoded}`, "_blank");
  };

  // -----------------------------
  //        ADMIN LOGIN UI
  // -----------------------------
  if (!authorized) {
    return (
      <div className="pt-32 flex flex-col items-center text-white">
        <h1 className="text-3xl font-bold text-[#16FF6E]">Admin Login</h1>

        <form className="mt-6 w-72 space-y-4" onSubmit={loginAdmin}>
          <input
            className="p-3 rounded text-black w-full"
            placeholder="Username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
          />

          <input
            type="password"
            className="p-3 rounded text-black w-full"
            placeholder="Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />

          <button className="w-full py-2 bg-[#16FF6E] text-black rounded font-bold">
            Login
          </button>
        </form>
      </div>
    );
  }

  // -----------------------------
  //       MAIN ADMIN PANEL
  // -----------------------------
  return (
    <div className="pt-28 px-6 text-white">
      <h1 className="text-3xl font-bold text-[#16FF6E]">Admin — Partner Groups</h1>

      {loading ? (
        <p className="mt-4 text-gray-400">Loading...</p>
      ) : groups.length === 0 ? (
        <p className="mt-4 text-gray-400">No groups found.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {groups.map((g) => (
            <div
              key={g.id}
              className="p-4 bg-black/40 rounded-xl border border-[#16FF6E]/30"
            >
              <p className="text-xl font-bold">
                {g.category} → {g.option}
              </p>

              <p className="mt-1">
                Status:{" "}
                <span
                  className={
                    g.status === "ready"
                      ? "text-green-400"
                      : g.status === "completed"
                      ? "text-blue-400"
                      : "text-yellow-400"
                  }
                >
                  {g.status}
                </span>
              </p>

              <p className="mt-1 text-[#16FF6E] font-bold">
                {g.membersCount}/{g.requiredSize} partners
              </p>

              {/* MEMBERS LIST */}
              <div className="mt-4">
                <p className="font-bold text-lg">Members:</p>
                <ul className="mt-2 ml-4 list-disc">
                  {g.membersDetailed.map((m: any, i: number) => (
                    <li key={i} className="text-sm">
                      {m.name} — {m.phone}
                    </li>
                  ))}
                </ul>
              </div>

              {/* ADMIN BUTTONS */}
              <div className="flex gap-2 mt-4 flex-wrap">
                <button
                  onClick={() => contactAll(g)}
                  className="px-3 py-1 bg-green-600 rounded text-sm font-bold"
                >
                  WhatsApp All
                </button>

                <button
                  onClick={() => contactOne(g)}
                  className="px-3 py-1 bg-green-800 rounded text-sm"
                >
                  Message One
                </button>

                <button
                  onClick={() => markCompleted(g.id)}
                  className="px-3 py-1 bg-blue-600 rounded text-sm"
                >
                  Mark Completed
                </button>

                <button
                  onClick={() => exportCSV(g)}
                  className="px-3 py-1 bg-purple-600 rounded text-sm"
                >
                  Export CSV
                </button>

                <button
                  onClick={() => deleteGroup(g.id)}
                  className="px-3 py-1 bg-red-600 rounded text-sm"
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
