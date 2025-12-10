"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [guest, setGuest] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("loggedIn") === "true") setLoggedIn(true);
    if (localStorage.getItem("guest") === "true") setGuest(true);
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      {/* TOGGLE BUTTON (RIGHT TOP) */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-6 right-4 z-50 bg-[#16FF6E] text-black px-3 py-2 rounded-md shadow-lg font-bold"
      >
        ☰
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        />
      )}

      {/* SIDEBAR PANEL (RIGHT) */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-black border-l border-[#16FF6E]/30 z-50 p-6 transform transition-all ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#16FF6E]">Menu</h2>
          <button onClick={() => setOpen(false)} className="text-gray-400">
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4 text-sm">

          {/* MAIN LINKS */}
          <Link
            href="/"
            className="text-gray-200 hover:text-[#16FF6E]"
            onClick={() => setOpen(false)}
          >
            🏠 Home
          </Link>

          <Link
            href="/categories"
            className="text-gray-200 hover:text-[#16FF6E]"
            onClick={() => setOpen(false)}
          >
            🛍 Categories
          </Link>

          <Link
            href="/dashboard"
            className="text-gray-200 hover:text-[#16FF6E]"
            onClick={() => setOpen(false)}
          >
            🤝 My Matches
          </Link>

          {(loggedIn || guest) && (
            <Link
              href="/profile"
              className="text-gray-200 hover:text-[#16FF6E]"
              onClick={() => setOpen(false)}
            >
              👤 My Profile
            </Link>
          )}

          {/* HELP / AI */}
          <Link
            href="/help"
            className="text-gray-200 hover:text-[#16FF6E]"
            onClick={() => setOpen(false)}
          >
            ❓ How Splitting Works
          </Link>

          <Link
            href="/ai"
            className="text-gray-200 hover:text-[#16FF6E]"
            onClick={() => setOpen(false)}
          >
            🤖 AI Chat
          </Link>

          {/* LOGIN / LOGOUT */}
          {!loggedIn && !guest && (
            <Link
              href="/login"
              className="text-gray-200 hover:text-[#16FF6E]"
              onClick={() => setOpen(false)}
            >
              🔐 Login / Signup
            </Link>
          )}

          {(loggedIn || guest) && (
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="text-red-400 hover:text-red-300 text-left"
            >
              🚪 Logout
            </button>
          )}

          {/* HIDDEN ADMIN LINK */}
          <button
            onClick={() => (window.location.href = "/admin")}
            className="text-[10px] text-gray-500 opacity-20 text-left hover:opacity-100 mt-4"
          >
            admin panel
          </button>
        </div>
      </div>
    </>
  );
}
