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

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "Hari@2307";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ------------------------------------------
       AUTO LOGIN
  ------------------------------------------ */
  useEffect(() => {
    if (localStorage.getItem("isAdmin") === "true") {
      setAuthorized(true);
    }
  }, []);

  /* ------------------------------------------
       FETCH GROUPS
  ------------------------------------------ */
  useEffect(() => {
    if (!authorized) return;

    setLoading(true);
    const ref = collection(db, "groups");
    const q = query(ref, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, async (snap) => {
      const list: any[] = [];

      for (const g of snap.docs) {
        const data = g.data() as any;

        const membersDetailed: any[] = [];
        for (const phone of data.members || []) {
          const cleanPhone = (phone as string).trim();

          const userRef = doc(db, "users", cleanPhone);
          const userSnap = await getDoc(userRef);

          membersDetailed.push({
            phone: cleanPhone,
            name: userSnap.exists() ? userSnap.data()?.name : "Unknown User",
          });
        }

        list.push({
          id: g.id,
          ...data,
          members: data.members?.map((p: string) => p.trim()) || [],
          membersDetailed,
        });
      }

      setGroups(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authorized]);

  /* ------------------------------------------
       ADMIN LOGIN
  ------------------------------------------ */
  const loginAdmin = (e: any) => {
    e.preventDefault();
    if (usernameInput === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
      localStorage.setItem("isAdmin", "true");
      setAuthorized(true);
    } else {
      alert("❌ Wrong username or password");
    }
  };

  /* ------------------------------------------
       ADMIN LOGOUT
  ------------------------------------------ */
  const adminLogout = () => {
    localStorage.removeItem("isAdmin");
    setAuthorized(false);
    alert("Logged out of admin panel.");
  };

  /* ------------------------------------------
       MARK COMPLETED
  ------------------------------------------ */
  const markCompleted = async (id: string) => {
    await updateDoc(doc(db, "groups", id), { status: "completed" });
    alert("✔ Group marked completed");
  };

  /* ------------------------------------------
       DELETE ENTIRE GROUP
  ------------------------------------------ */
  const deleteGroup = async (id: string) => {
    if (!confirm("Delete this group?")) return;
    await deleteDoc(doc(db, "groups", id));
    alert("❌ Deleted Group");
  };

  /* ------------------------------------------
       REMOVE A MEMBER (and update status)
  ------------------------------------------ */
  const removeMember = async (groupId: string, phone: string) => {
    if (!confirm("Remove this member?")) return;

    try {
      const gRef = doc(db, "groups", groupId);
      const snap = await getDoc(gRef);

      if (!snap.exists()) return alert("Group missing.");

      const data = snap.data() as any;

      const members: string[] = (data.members || []).map((p: string) =>
        p.trim()
      );
      const filtered = members.filter((p) => p !== phone.trim());

      const currentCount =
        data.membersCount !== undefined
          ? data.membersCount
          : members.length;

      const newCount = Math.max(0, currentCount - 1);
      const required = data.requiredSize || filtered.length;

      await updateDoc(gRef, {
        members: filtered,
        membersCount: newCount,
        status: newCount < required ? "waiting" : data.status,
      });

      alert("Member removed.");
    } catch (err) {
      console.error(err);
      alert("Failed to remove member.");
    }
  };

  /* ------------------------------------------
       EXPORT CSV
  ------------------------------------------ */
  const exportCSV = (g: any) => {
    const csv = (g.members || []).join(",");
    const blob = new Blob([csv], { type: "text/csv" });
    window.open(URL.createObjectURL(blob));
  };

  /* ------------------------------------------
       WHATSAPP ALL
  ------------------------------------------ */
  const contactAll = (g: any) => {
    if (!g.members?.length) return alert("No numbers available.");

    const message =
      `👋 *Split Partnering Update*\n\n` +
      `Your group for *${g.category} → ${g.option}* is ready.\n` +
      `Members: ${g.membersCount}/${g.requiredSize}\n\n` +
      `Admin will coordinate next steps.\n`;

    const encoded = encodeURIComponent(message);

    g.members.forEach((p: string) => {
      const waNumber = "91" + p.trim();
      window.open(`https://wa.me/${waNumber}?text=${encoded}`);
    });
  };

  /* ------------------------------------------
       WHATSAPP ONE
  ------------------------------------------ */
  const contactOne = (g: any) => {
    if (!g.members.length) return alert("No numbers");

    const choice = prompt(
      `Enter number to contact:\n\n${g.members.join("\n")}`
    );
    if (!choice) return;

    const clean = choice.trim();

    if (!g.members.includes(clean))
      return alert("This number is not a member in this group.");

    const encoded = encodeURIComponent("Hello! Your group is active.");
    const waNumber = "91" + clean;

    window.open(`https://wa.me/${waNumber}?text=${encoded}`);
  };

  /* ------------------------------------------
       LOGIN SCREEN
  ------------------------------------------ */
  if (!authorized) {
    return (
      <div className="pt-32 text-white flex flex-col items-center">
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

          <button className="w-full bg-[#16FF6E] py-2 text-black rounded font-bold">
            Login
          </button>
        </form>
      </div>
    );
  }

  /* ------------------------------------------
       ADMIN DASHBOARD
  ------------------------------------------ */
  return (
    <div className="pt-28 px-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#16FF6E]">
          Admin — Partner Groups
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() => (window.location.href = "/")}
            className="px-3 py-1 bg-gray-700 rounded text-xs"
          >
            Home
          </button>

          <button
            onClick={adminLogout}
            className="px-3 py-1 bg-red-600 rounded text-xs"
          >
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <p className="mt-4 text-gray-400">Loading…</p>
      ) : groups.length === 0 ? (
        <p className="mt-4 text-gray-400">No groups found.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {groups.map((g) => (
            <div
              key={g.id}
              className="p-4 bg-black/40 border border-[#16FF6E]/30 rounded-xl"
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

              <div className="mt-4">
                <p className="font-bold">Members:</p>
                <ul className="ml-4 mt-2 list-disc">
                  {g.membersDetailed.map((m: any, i: number) => (
                    <li key={i}>
                      {m.name} — {m.phone}
                      <button
                        onClick={() => removeMember(g.id, m.phone)}
                        className="ml-2 px-2 py-1 bg-red-600 rounded text-xs"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  className="px-3 py-1 bg-green-600 rounded text-sm"
                  onClick={() => contactAll(g)}
                >
                  WhatsApp All
                </button>

                <button
                  className="px-3 py-1 bg-green-800 rounded text-sm"
                  onClick={() => contactOne(g)}
                >
                  Message One
                </button>

                <button
                  className="px-3 py-1 bg-blue-600 rounded text-sm"
                  onClick={() => markCompleted(g.id)}
                >
                  Mark Completed
                </button>

                <button
                  className="px-3 py-1 bg-purple-600 rounded text-sm"
                  onClick={() => exportCSV(g)}
                >
                  Export CSV
                </button>

                <button
                  className="px-3 py-1 bg-red-600 rounded text-sm"
                  onClick={() => deleteGroup(g.id)}
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
