"use client";

import { useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/firebase/config";

// Global window types
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

  // Setup Recaptcha
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,                    // Auth first
        "recaptcha-container",   // Element ID second
        { size: "invisible" }    // Config third
      );
    }
    return window.recaptchaVerifier;
  };

  // Send OTP
  const sendOTP = async () => {
    if (!phone) return alert("Enter your phone number.");
    setLoading(true);

    try {
      const verifier = setupRecaptcha();

      const confirmation = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        verifier
      );

      window.confirmationResult = confirmation;
      alert("OTP Sent!");
    } catch (error: any) {
      console.error("OTP Error:", error.code, error.message);
      alert("Failed to send OTP.");
    }

    setLoading(false);
  };

  // Verify OTP
  const verifyOTP = async () => {
    if (!otp) return alert("Enter OTP.");

    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;

      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("phone", user.phoneNumber);

      alert("Login Successful!");

      // Redirect to Profile
      window.location.href = "/profile";
    } catch (error) {
      alert("Invalid OTP.");
    }
  };

  return (
    <div className="text-white pt-32 flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold text-[#16FF6E]">Login with OTP</h1>

      <input
        type="tel"
        placeholder="Enter Mobile Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="p-3 rounded text-black w-64"
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
        className="p-3 rounded text-black w-64 mt-3"
      />

      <button
        onClick={verifyOTP}
        className="bg-cyan-400 text-black px-6 py-2 rounded font-bold"
      >
        Verify OTP
      </button>

      <div id="recaptcha-container"></div>
    </div>
  );
}
