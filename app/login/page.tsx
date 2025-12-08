"use client";

import { useEffect, useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

// Extend window for Firebase OTP objects
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

  /** -----------------------------------------------------------
   *  1. INITIALIZE INVISIBLE RECAPTCHA ONLY ONCE
   * ----------------------------------------------------------*/
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Create only ONCE — NEVER recreate
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",       // element
        { size: "invisible" },       // invisible recaptcha
        auth                          // firebase auth
      );
    }
  }, []);

  /** -----------------------------------------------------------
   *  2. SEND OTP (confirmationResult stored only once)
   * ----------------------------------------------------------*/
  const sendOTP = async () => {
    if (!phone) return alert("Enter mobile number");

    setLoading(true);
    try {
      const verifier = window.recaptchaVerifier;

      const confirmation = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        verifier!
      );

      // store confirmation for OTP verification
      window.confirmationResult = confirmation;
      alert("OTP sent!");
    } catch (error: any) {
      console.error("OTP Error:", error);

      if (
        error?.code === "auth/captcha-check-failed" ||
        error?.message?.includes("Hostname match not found")
      ) {
        alert(
          "reCAPTCHA failed. Add your Vercel domain in Firebase → Authentication → Authorized Domains."
        );
      } else {
        alert("Failed to send OTP.");
      }
    } finally {
      setLoading(false);
    }
  };

  /** -----------------------------------------------------------
   *  3. VERIFY OTP (no reload, same confirmationResult)
   * ----------------------------------------------------------*/
  const verifyOTP = async () => {
    if (!otp) return alert("Enter OTP");

    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;
      const phoneNumber = user.phoneNumber;

      // Save login locally
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("phone", phoneNumber ?? "");

      /** Check if new user — redirect to profile */
      if (phoneNumber) {
        const userRef = doc(db, "users", phoneNumber);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          alert("Welcome! Please complete your profile.");
          window.location.href = "/profile";
          return;
        }
      }

      alert("Login successful!");
      window.location.href = "/categories";
    } catch (error) {
      console.error("OTP Verify Error:", error);
      alert("Invalid OTP");
    }
  };

  return (
    <div className="pt-32 px-6 text-white flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold text-[#16FF6E]">Login with OTP</h1>

      {/* PHONE INPUT */}
      <input
        type="tel"
        placeholder="Enter mobile number (without +91)"
        value={phone}
        onChange={(e) => setPhone(e.target.value.replace(/\s/g, ""))}
        className="p-3 rounded text-black w-64"
      />

      {/* SEND OTP BUTTON */}
      <button
        onClick={sendOTP}
        disabled={loading}
        className="px-6 py-2 bg-[#16FF6E] text-black rounded font-bold"
      >
        {loading ? "Sending..." : "Send OTP"}
      </button>

      {/* OTP INPUT */}
      <input
        type="number"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="p-3 rounded text-black w-64 mt-2"
      />

      {/* VERIFY BUTTON */}
      <button
        onClick={verifyOTP}
        className="px-6 py-2 bg-cyan-400 text-black rounded font-bold"
      >
        Verify OTP
      </button>

      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container"></div>
    </div>
  );
}
