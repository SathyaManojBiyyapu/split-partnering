"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [guest, setGuest] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("loggedIn") === "true") setLoggedIn(true);
    if (localStorage.getItem("guest") === "true") setGuest(true);
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      {/* ========== SIDEBAR BUTTON ========== */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-6 left-4 z-50 bg-[#16FF6E] text-black px-3 py-2 rounded-md shadow-lg font-bold"
      >
        ☰
      </button>

      {/* ========== OVERLAY ========== */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        />
      )}

      {/* ========== SIDEBAR PANEL ========== */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black border-r border-[#16FF6E]/30 z-50 p-6 transform transition-all ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-xl font-bold text-[#16FF6E] mb-6">Menu</h2>

        <div className="flex flex-col gap-4 text-sm">

          {/* PROFILE */}
          {(loggedIn || guest) && (
            <Link
              href="/profile"
              className="text-gray-200 hover:text-[#16FF6E]"
              onClick={() => setOpen(false)}
            >
              👤 My Profile
            </Link>
          )}

          {/* LOGIN */}
          {!loggedIn && !guest && (
            <Link
              href="/login"
              className="text-gray-200 hover:text-[#16FF6E]"
              onClick={() => setOpen(false)}
            >
              🔐 Login / Signup
            </Link>
          )}

          {/* DETAILS */}
          <Link
            href="/info"
            className="text-gray-200 hover:text-[#16FF6E]"
            onClick={() => setOpen(false)}
          >
            📄 My Details / Info
          </Link>

          {/* ABOUT */}
          <Link
            href="/about"
            className="text-gray-200 hover:text-[#16FF6E]"
            onClick={() => setOpen(false)}
          >
            ℹ️ About Project
          </Link>

          {/* HELP */}
          <Link
            href="/help"
            className="text-gray-200 hover:text-[#16FF6E]"
            onClick={() => setOpen(false)}
          >
            ❓ How Splitting Works
          </Link>

          {/* AI CHAT */}
          <Link
            href="/ai"
            className="text-gray-200 hover:text-[#16FF6E]"
            onClick={() => setOpen(false)}
          >
            🤖 AI Chat
          </Link>

          {/* LOGOUT */}
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

          {/* HIDDEN ADMIN BUTTON */}
          <button
            onClick={() => (window.location.href = "/admin")}
            className="text-[10px] text-gray-500 opacity-20 text-left hover:opacity-100"
          >
            admin panel
          </button>
        </div>
      </div>
    </>
  );
}
