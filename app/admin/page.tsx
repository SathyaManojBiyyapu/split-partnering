"use client";

import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
  const auth = useAuth();
  const user = auth?.user;

  if (!user) {
    return (
      <div className="pt-32 text-center text-white">
        <h1 className="text-2xl">Access Restricted</h1>
        <p className="text-gray-400 mt-2">Please log in first.</p>
      </div>
    );
  }

  return (
    <div className="pt-32 text-center text-white">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-300 mt-4">Welcome, {user.phoneNumber}</p>
    </div>
  );
}
