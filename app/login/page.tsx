"use client";

import { useState } from "react";
import { auth } from "@/firebase/config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Add types to window
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | null;
    confirmationResult: any;
  }
}

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // Setup invisible Recaptcha
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container", // element ID
        { size: "invisible" }, // config
        auth                   // auth instance
      );
    }
    return window.recaptchaVerifier;
  };

  // Send OTP
  const sendOTP = async () => {
    if (!phone) return alert("Enter mobile number");
    setLoading(true);

    try {
      const recaptcha = setupRecaptcha();

      const confirmation = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        recaptcha
      );

      window.confirmationResult = confirmation;
      alert("OTP sent!");
    } catch (error: any) {
      console.error("OTP Error:", error.code, error.message);
      alert("Failed to send OTP. Check console.");
    }

    setLoading(false);
  };

  // Verify OTP
  const verifyOTP = async () => {
    if (!otp) return alert("Enter OTP");

    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;

      // Save login status
      localStorage.setItem("loggedIn", "true");

      // Save phone number
      localStorage.setItem("phone", user.phoneNumber);

      alert("Login successful!");

      // Redirect to categories
      window.location.href = "/categories";

    } catch (error) {
      console.error("OTP Verify Error:", error);
      alert("Invalid OTP");
    }
  };

  return (
    <div className="text-white pt-32 flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold mb-4 text-[#16FF6E]">Login with OTP</h1>

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

      <div id="recaptcha-container"></div>
    </div>
  );
}
