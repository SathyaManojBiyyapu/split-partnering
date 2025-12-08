"use client";

import { useState, useEffect } from "react";
import { auth } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  /* -----------------------------------------------------------
     1️⃣ INIT INVISIBLE RECAPTCHA (CORRECT SIGNATURE)
  ----------------------------------------------------------- */
  useEffect(() => {
    const loadRecaptcha = async () => {
      if (typeof window === "undefined") return;
      if (window.recaptchaVerifier) return; // avoid duplicate

      const { RecaptchaVerifier } = await import("firebase/auth");

      // ✅ Correct RecaptchaVerifier signature for your version
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,                            // FIRST ARG ⇒ auth
        "recaptcha-container",           // SECOND ARG ⇒ HTML ID
        { size: "invisible" }            // THIRD ARG ⇒ config
      );
    };

    loadRecaptcha();
  }, []);

  /* -----------------------------------------------------------
     2️⃣ SEND OTP  (dynamic import)
  ----------------------------------------------------------- */
  const sendOTP = async () => {
    if (!phone) return alert("Enter mobile number");
    setLoading(true);

    try {
      const { signInWithPhoneNumber } = await import("firebase/auth");

      const fullPhone = "+91" + phone;

      const confirmation = await signInWithPhoneNumber(
        auth,
        fullPhone,
        window.recaptchaVerifier
      );

      window.confirmationResult = confirmation;
      alert("OTP sent!");
    } catch (err: any) {
      console.error("OTP Error:", err);
      alert(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------------------------
     3️⃣ VERIFY OTP
  ----------------------------------------------------------- */
  const verifyOTP = async () => {
    if (!otp) return alert("Enter OTP");

    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;
      const phoneNumber = user.phoneNumber!;

      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("phone", phoneNumber);

      // Check if profile exists
      const ref = doc(db, "users", phoneNumber);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        alert("Welcome! Please complete your profile.");
        window.location.href = "/profile";
        return;
      }

      alert("Login successful!");
      window.location.href = "/categories";
    } catch (err) {
      console.error("Verify Error:", err);
      alert("Invalid OTP");
    }
  };

  return (
    <div className="pt-32 px-6 text-white flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold text-[#16FF6E]">Login with OTP</h1>

      {/* PHONE INPUT */}
      <input
        type="tel"
        placeholder="Enter mobile number"
        value={phone}
        onChange={(e) => setPhone(e.target.value.replace(/\s/g, ""))}
        className="p-3 rounded text-black w-64"
      />

      {/* SEND OTP */}
      <button
        onClick={sendOTP}
        disabled={loading}
        className="px-6 py-2 bg-[#16FF6E] text-black rounded font-bold"
      >
        {loading ? "Sending…" : "Send OTP"}
      </button>

      {/* OTP INPUT */}
      <input
        type="number"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="p-3 rounded text-black w-64 mt-2"
      />

      {/* VERIFY */}
      <button
        onClick={verifyOTP}
        className="px-6 py-2 bg-cyan-400 text-black rounded font-bold"
      >
        Verify OTP
      </button>

      {/* REQUIRED RECAPTCHA ELEMENT */}
      <div id="recaptcha-container"></div>
    </div>
  );
}
