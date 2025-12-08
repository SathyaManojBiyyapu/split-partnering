"use client";

import { useEffect, useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

// Extend window types
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

  // Setup Recaptcha (auth MUST be last param signature variant used below)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.recaptchaVerifier) {
      // Use RecaptchaVerifier(elemId, config, auth) variant for compatibility
      // Some firebase versions accept (auth, elementOrId, config) — we use element-first to match runtime earlier working code
      // We'll use RecaptchaVerifier with element id first (string), config second, auth third
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible" },
        auth
      );
    }
  }, []);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible" },
        auth
      );
    }
    return window.recaptchaVerifier;
  };

  const sendOTP = async () => {
    if (!phone) return alert("Enter mobile number");
    setLoading(true);
    try {
      const recaptcha = setupRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, "+91" + phone, recaptcha);
      window.confirmationResult = confirmation;
      alert("OTP sent!");
    } catch (error: any) {
      console.error("OTP Error:", error?.code ?? error, error?.message ?? "");
      alert("Failed to send OTP. Check console.");
      // If captcha failed
      if (error?.code === "auth/captcha-check-failed" || error?.message?.includes("Hostname match not found")) {
        alert("reCAPTCHA error — ensure your domain is authorized in Firebase Auth.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and redirect to profile if new user
  const verifyOTP = async () => {
    if (!otp) return alert("Enter OTP");
    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;
      const phoneNumber = user.phoneNumber;
      // Save login status
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("phone", phoneNumber ?? "");

      // Check if profile exists
      try {
        if (phoneNumber) {
          const userRef = doc(db, "users", phoneNumber);
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            alert("Welcome! Please complete your profile.");
            window.location.href = "/profile";
            return;
          }
        }
      } catch (err) {
        console.error("Error checking profile:", err);
      }

      alert("Login successful!");
      window.location.href = "/categories";
    } catch (err) {
      console.error("OTP Verify Error:", err);
      alert("Invalid OTP");
    }
  };

  return (
    <div className="pt-32 px-6 text-white flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold text-[#16FF6E]">Login with OTP</h1>

      <input
        type="tel"
        placeholder="Enter mobile number (without +91)"
        value={phone}
        onChange={(e) => setPhone(e.target.value.replace(/\s/g, ""))}
        className="p-3 rounded text-black w-64"
      />

      <button
        onClick={sendOTP}
        disabled={loading}
        className="px-6 py-2 bg-[#16FF6E] text-black rounded font-bold"
      >
        {loading ? "Sending..." : "Send OTP"}
      </button>

      <input
        type="number"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="p-3 rounded text-black w-64 mt-2"
      />

      <button
        onClick={verifyOTP}
        className="px-6 py-2 bg-cyan-400 text-black rounded font-bold"
      >
        Verify OTP
      </button>

      <div id="recaptcha-container"></div>
    </div>
  );
}
