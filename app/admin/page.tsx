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

export default function AdminPage() {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "Hari@2307";

  useEffect(() => {
    const ok = localStorage.getItem("isAdmin") === "true";
    if (ok) setAuthorized(true);
  }, []);

  useEffect(() => {
    if (!authorized) return;

    setLoading(true);
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setGroups(list);
        setLoading(false);
      },
      (err) => {
        console.error("Admin listener error:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [authorized]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
      setAuthorized(true);
      localStorage.setItem("isAdmin", "true");
    } else {
      alert("Invalid username or password");
    }
  };

  const markCompleted = async (id: string) => {
    try {
      await updateDoc(doc(db, "groups", id), { status: "completed" });
      alert("Marked completed");
    } catch (err) {
      console.error(err);
      alert("Error");
    }
  };

  const removeGroup = async (id: string) => {
    if (!confirm("Delete this partner group?")) return;
    try {
      await deleteDoc(doc(db, "groups", id));
      alert("Deleted");
    } catch (err) {
      console.error(err);
      alert("Error deleting");
    }
  };

  const exportCSV = async (id: string) => {
    const g = groups.find((x) => x.id === id);
    if (!g) return alert("Not found");
    const phones = (g.members || []).join("\n");
    try {
      await navigator.clipboard.writeText(phones);
      alert("Phone numbers copied to clipboard");
    } catch {
      const csv = (g.members || []).join(",");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
  };

  // WhatsApp helpers
  const contactAll = (group: any) => {
    const phones = group.members || [];
    if (!phones.length) return alert("No phone numbers available");

    const message =
      `👋 Split Partnering Update\n\n` +
      `Your partner group for ${group.category} → ${group.option} is ready!\n\n` +
      `Group ID: ${group.id}\n` +
      `Members: ${group.membersCount}/${group.requiredSize}\n\n` +
      `An admin will coordinate next steps.`;

    const encoded = encodeURIComponent(message);

    phones.forEach((p: string) => {
      // ensure phone has country prefix (if already stored with +91 or 91, use as is)
      const cleaned = p.replace(/\+/g, "");
      window.open(`https://wa.me/${cleaned}?text=${encoded}`, "_blank");
    });
  };

  const contactIndividually = (group: any) => {
    const phones = group.members || [];
    if (!phones.length) return alert("No phone numbers available");

    const message =
      `👋 Split Partnering Update\n\n` +
      `Your partner group for ${group.category} → ${group.option} is ready!\n\n` +
      `Group ID: ${group.id}\n` +
      `Members: ${group.membersCount}/${group.requiredSize}\n\n` +
      `Reply to coordinate with admin.`;

    const encoded = encodeURIComponent(message);

    const choice = prompt(`Enter partner number to message:\n\n${phones.join("\n")}`);
    if (choice && phones.includes(choice.trim())) {
      const cleaned = choice.trim().replace(/\+/g, "");
      window.open(`https://wa.me/${cleaned}?text=${encoded}`, "_blank");
    } else if (choice) {
      alert("Number not in group");
    }
  };

  // optional small helper to fetch and show user name for a phone (not called automatically for perf)
  const fetchUserName = async (phone: string) => {
    try {
      const uref = doc(db, "users", phone);
      const s = await getDoc(uref);
      if (s.exists()) {
        return (s.data() as any).name || phone;
      }
      return phone;
    } catch {
      return phone;
    }
  };

  if (!authorized) {
    return (
      <div className="pt-32 px-6 text-white">
        <h1 className="text-3xl font-bold text-[#16FF6E]">Admin Login</h1>
        <form onSubmit={handleLogin} className="mt-6 max-w-sm space-y-4">
          <input
            type="text"
            placeholder="Enter username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="p-3 rounded w-72 text-black"
          />
          <input
            type="password"
            placeholder="Enter password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="p-3 rounded w-72 text-black"
          />
          <button className="px-6 py-2 bg-[#16FF6E] text-black rounded font-bold">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="pt-28 px-6 text-white">
      <h1 className="text-3xl font-bold text-[#16FF6E]">Admin — Partner Groups</h1>

      {loading ? (
        <p className="mt-4 text-gray-400">Loading groups...</p>
      ) : groups.length === 0 ? (
        <p className="mt-4 text-gray-400">No groups yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {groups.map((g) => (
            <div key={g.id} className="p-4 bg-black/40 rounded-xl border border-[#16FF6E]/30">
              <div className="flex justify-between items-start">
                <div>
                  <p><strong>Category:</strong> {g.category}</p>
                  <p><strong>Option:</strong> {g.option}</p>
                  <p><strong>Status:</strong> <span className={g.status === "ready" ? "text-green-400" : g.status === "completed" ? "text-blue-400" : "text-yellow-400"}>{g.status}</span></p>
                  <p><strong>Partners:</strong> {g.membersCount}/{g.requiredSize}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <button onClick={() => contactAll(g)} className="px-3 py-1 bg-[#25D366] rounded text-sm font-bold">WhatsApp All</button>
                  <button onClick={() => contactIndividually(g)} className="px-3 py-1 bg-green-700 rounded text-sm">Contact Each</button>
                  <button onClick={() => markCompleted(g.id)} className="px-3 py-1 bg-green-600 rounded text-sm">Mark Completed</button>
                  <button onClick={() => exportCSV(g.id)} className="px-3 py-1 bg-blue-600 rounded text-sm">Export Numbers</button>
                  <button onClick={() => removeGroup(g.id)} className="px-3 py-1 bg-red-600 rounded text-sm">Delete Group</button>
                </div>
              </div>

              <div className="mt-4">
                <p className="font-medium">Members (phone numbers):</p>
                <ul className="mt-2 ml-4 list-disc">
                  {(g.members || []).map((m: string, i: number) => (
                    <li key={i} className="text-sm">
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
