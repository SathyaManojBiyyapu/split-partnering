"use client";

import { useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/firebase/config";

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
  const [otpSent, setOtpSent] = useState(false);

  /* ------------------------------------------
     SETUP RECAPTCHA
  ------------------------------------------ */
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }
    return window.recaptchaVerifier;
  };

  /* ------------------------------------------
     LOGIN WITH OTP (SEND + VERIFY)
  ------------------------------------------ */
  const handleLoginWithOTP = async () => {
    if (!phone || phone.length !== 10) {
      return alert("Enter valid 10-digit mobile number");
    }

    try {
      setLoading(true);

      // STEP 1: SEND OTP
      if (!otpSent) {
        const verifier = setupRecaptcha();
        const confirmation = await signInWithPhoneNumber(
          auth,
          "+91" + phone,
          verifier
        );

        window.confirmationResult = confirmation;
        setOtpSent(true);
        alert("OTP sent to your mobile");
        return;
      }

      // STEP 2: VERIFY OTP
      if (!otp) return alert("Enter OTP");

      await window.confirmationResult.confirm(otp);

      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("phone", phone.trim());
      localStorage.removeItem("guest");

      alert("Login successful!");
      window.location.href = "/profile";
    } catch (err) {
      console.error(err);
      alert("OTP failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 flex flex-col items-center text-white">
      <h1 className="text-3xl font-bold text-gold-primary mb-6">
        Login / Signup
      </h1>

      <input
        type="tel"
        placeholder="Enter Mobile Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="neon-input w-64"
        disabled={otpSent}
      />

      {otpSent && (
        <input
          type="number"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="neon-input w-64 mt-4"
        />
      )}

      {/* OTP BUTTON */}
      <button
        onClick={handleLoginWithOTP}
        disabled={loading}
        className="bg-gold-primary text-black font-bold px-6 py-3 rounded-xl mt-4
                   hover:bg-white transition-all"
      >
        {loading
          ? "Please wait..."
          : otpSent
          ? "Verify OTP"
          : "Login with OTP"}
      </button>

      {/* ADMIN */}
      <button
        onClick={() => (window.location.href = "/admin")}
        className="text-[10px] opacity-30 mt-6"
      >
        admin
      </button>

      <div id="recaptcha-container"></div>
    </div>
  );
}
