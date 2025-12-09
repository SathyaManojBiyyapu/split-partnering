"use client";

import { useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/firebase/config";

// ✅ Add global window types HERE (CORRECT PLACE)
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

  // 🔥 Setup invisible Recaptcha (MODULAR Firebase v9 Syntax)
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,                    // ✔ AUTH FIRST
        "recaptcha-container",   // ✔ ELEMENT ID SECOND
        { size: "invisible" }    // ✔ CONFIG THIRD
      );
    }
    return window.recaptchaVerifier;
  };

  // 🔥 Send OTP
  const sendOTP = async () => {
    if (!phone) return alert("Enter mobile number");
    setLoading(true);

    try {
      const verifier = setupRecaptcha();

      const confirmation = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        verifier
      );

      window.confirmationResult = confirmation;
      alert("OTP sent!");
    } catch (err: any) {
      console.error("OTP Error:", err.code, err.message);
      alert("Failed to send OTP.");
    }

    setLoading(false);
  };

  // 🔥 Verify OTP
  const verifyOTP = async () => {
    if (!otp) return alert("Enter OTP");

    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;

      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("phone", user.phoneNumber);

      alert("Login successful!");
      window.location.href = "/categories";
    } catch (err) {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="text-white pt-32 flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold text-[#16FF6E]">Login with OTP</h1>

      <input
        type="tel"
        placeholder="Enter mobile number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="p-3 rounded text-black w-60"
      />

      <button
        onClick={sendOTP}
        disabled={loading}
        className="bg-[#16FF6E] text-black px-6 py-2 rounded font-bold"
      >
        {loading ? "Sending..." : "Send OTP"}
      </button>

      <input
        type="number"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="p-3 rounded text-black w-60 mt-4"
      />

      <button
        onClick={verifyOTP}
        className="bg-cyan-400 text-black px-6 py-2 rounded font-bold"
      >
        Verify OTP
      </button>

      {/* Required by Firebase */}
      <div id="recaptcha-container"></div>
    </div>
  );
}
