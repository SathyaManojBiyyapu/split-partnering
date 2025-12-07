"use client";

import { useState } from "react";
import { auth } from "@/firebase/config";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

// Add this for TypeScript
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | null;
    confirmationResult: any;
  }
}

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);

  // ⭐ Correct Firebase Recaptcha Setup
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",         // <-- element ID FIRST
        {
          size: "invisible",
          callback: () => {
            console.log("Captcha Solved!");
          },
        },
        auth                              // <-- auth goes LAST
      );
    }
    return window.recaptchaVerifier;
  };

  // ⭐ SEND OTP
  const sendOTP = async () => {
    if (!phone) return alert("Enter mobile number");

    try {
      const recaptchaVerifier = setupRecaptcha();

      const result = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        recaptchaVerifier
      );

      setConfirmation(result);
      alert("OTP sent!");
    } catch (error: any) {
      console.error("OTP Error:", error);
      alert(error.message);
    }
  };

  // ⭐ VERIFY OTP
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

      <br /> <br />

      <button
        onClick={sendOTP}
        style={{
          padding: "10px 20px",
          background: "lime",
          borderRadius: 5,
        }}
      >
        Send OTP
      </button>

      <br /> <br />

      <input
        type="number"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        style={{ padding: 10, width: 250 }}
      />

      <br /> <br />

      <button
        onClick={verifyOTP}
        style={{
          padding: "10px 20px",
          background: "cyan",
          borderRadius: 5,
        }}
      >
        Verify OTP
      </button>

      {/* REQUIRED FOR CAPTCHA */}
      <div id="recaptcha-container"></div>
    </div>
  );
}
