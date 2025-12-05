"use client";

import { useState } from "react";
import { auth } from "@/firebase/config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Fix: allow global recaptcha reference
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | null;
  }
}

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);

  // ✅ CORRECT FIREBASE v9 RECAPTCHA SETUP
  const setupRecaptcha = () => {
    // Clear previous captcha
    window.recaptchaVerifier = null;

    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {
          console.log("Recaptcha solved!");
        }
      },
      auth // IMPORTANT: AUTH MUST BE LAST
    );

    return window.recaptchaVerifier;
  };

  const sendOTP = async () => {
    if (!phone) return alert("Enter mobile number");

    try {
      const recaptcha = setupRecaptcha();

      const result = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        recaptcha
      );

      setConfirmation(result);
      alert("OTP sent!");
    } catch (error: any) {
      console.error("OTP Error:", error.code, error.message);

      if (error.code === "auth/captcha-check-failed") {
        alert("Captcha failed. Refresh page.");
      } else if (error.code === "auth/invalid-app-credential") {
        alert("Domain not added in Firebase Authorized Domains.");
      } else {
        alert("Error sending OTP");
      }
    }
  };

  const verifyOTP = async () => {
    if (!otp) return alert("Enter OTP");

    try {
      await confirmation.confirm(otp);
      alert("Login successful!");
      window.location.href = "/categories";
    } catch (err) {
      alert("Invalid OTP");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1 style={{ color: "white" }}>Login with OTP</h1>

      <input
        type="tel"
        placeholder="Enter mobile number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ padding: 10, width: 250, marginTop: 20 }}
      />

      <br /><br />

      <button
        onClick={sendOTP}
        style={{ padding: "10px 20px", background: "lime", borderRadius: 5 }}
      >
        Send OTP
      </button>

      <br /><br />

      <input
        type="number"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        style={{ padding: 10, width: 250 }}
      />

      <br /><br />

      <button
        onClick={verifyOTP}
        style={{ padding: "10px 20px", background: "cyan", borderRadius: 5 }}
      >
        Verify OTP
      </button>

      {/* required for firebase */}
      <div id="recaptcha-container"></div>
    </div>
  );
}
