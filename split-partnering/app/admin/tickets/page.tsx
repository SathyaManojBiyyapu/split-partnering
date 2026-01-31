"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";

/* ================= UTIL ================= */

/* ✅ FORMAT DATE & TIME (UI ONLY) */
const formatDateTime = (ts: any) => {
  if (!ts?.seconds) return "N/A";
  const d = new Date(ts.seconds * 1000);
  return `${d.toLocaleDateString()} · ${d.toLocaleTimeString()}`;
};

/* ================= TYPES ================= */

type Ticket = {
  id: string;
  state: string;
  city: string;
  theatre: string;
  movie: string;
  showDate: string;
  showTime: string;
  quantity: number;
  status: string;
  sellerPhone: string;
};

type Request = {
  id: string;
  ticketId: string;
  buyerPhone?: string;
  status: string;
  createdAt?: any;
};

/* ================= PAGE ================= */

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    setLoading(true);

    const ticketsSnap = await getDocs(
      query(collection(db, "movieTickets"), orderBy("createdAt", "desc"))
    );

    const reqSnap = await getDocs(
      query(collection(db, "ticketRequests"), orderBy("createdAt", "desc"))
    );

    setTickets(
      ticketsSnap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }))
    );

    setRequests(
      reqSnap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }))
    );

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= ACTIONS ================= */

  // MARK TICKET AS SOLD
  const markSold = async (id: string) => {
    if (!confirm("Mark this ticket as SOLD?")) return;

    await updateDoc(doc(db, "movieTickets", id), {
      status: "sold",
    });

    loadData();
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="p-10 text-text-muted">
        Loading admin tickets…
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen pt-28 px-6 bg-black text-white">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-heading text-gold-primary mb-2">
          🎬 Admin · Movie Tickets
        </h1>
        <p className="text-sm text-text-muted">
          Review buyer requests and manage listed movie tickets
        </p>
      </div>

      {/* ================= BUYER REQUESTS ================= */}
      <section className="mb-14">
        <h2 className="text-xl font-heading text-gold-primary mb-4">
          Buyer Requests
        </h2>

        {requests.length === 0 ? (
          <p className="text-text-muted">No requests yet</p>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => (
              <div
                key={r.id}
                className="card-glass p-5 rounded-xl"
              >
                <div className="grid gap-1 text-sm">
                  <p>
                    <span className="text-gold-primary font-semibold">
                      Request ID:
                    </span>{" "}
                    {r.id}
                  </p>

                  <p>
                    <span className="text-gold-primary font-semibold">
                      Ticket ID:
                    </span>{" "}
                    {r.ticketId}
                  </p>

                  <p>
                    <span className="text-gold-primary font-semibold">
                      Buyer Phone:
                    </span>{" "}
                    {r.buyerPhone ?? "N/A"}
                  </p>

                  <p className="text-xs text-text-muted mt-1">
                    📅 {formatDateTime(r.createdAt)}
                  </p>

                  <p
                    className={`text-xs mt-1 ${
                      r.status === "approved"
                        ? "text-green-400"
                        : r.status === "rejected"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    Status: {r.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= TICKETS ================= */}
      <section>
        <h2 className="text-xl font-heading text-gold-primary mb-4">
          All Listed Tickets
        </h2>

        {tickets.length === 0 ? (
          <p className="text-text-muted">No tickets listed</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="card-glass p-6 rounded-2xl"
              >
                <h3 className="text-lg font-heading text-gold-primary mb-2">
                  {t.movie}
                </h3>

                <div className="space-y-1 text-sm text-text-muted">
                  <p>🎭 {t.theatre}</p>
                  <p>📍 {t.city}, {t.state}</p>
                  <p>🕒 {t.showDate} · {t.showTime}</p>
                  <p>🎟️ Quantity: {t.quantity}</p>
                  <p>📞 Seller: {t.sellerPhone}</p>
                </div>

                <p
                  className={`mt-3 font-semibold ${
                    t.status === "available"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {t.status.toUpperCase()}
                </p>

                {t.status === "available" && (
                  <button
                    onClick={() => markSold(t.id)}
                    className="w-full mt-4 btn-outline text-red-400 border-red-500 hover:bg-red-600 hover:text-white"
                  >
                    Mark as Sold
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
