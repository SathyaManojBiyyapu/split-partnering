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
    <div className="min-h-screen pt-28 flex flex-col items-center text-white">
      <h1 className="text-3xl font-bold text-gold-primary mb-8">
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

      {/* ===== PREMIUM GOLD OTP BUTTON ===== */}
      <button
        onClick={handleLoginWithOTP}
        disabled={loading}
        className="
          mt-6 px-8 py-3 rounded-xl font-bold
          bg-black
          text-[#E6C972]            /* champagne gold text */
          border border-[#E6C972]

          shadow-[inset_0_0_0_rgba(0,0,0,0),_0_0_18px_rgba(230,201,114,0.75)]

          hover:bg-[#F3DC8A]        /* soft luxury gold */
          hover:text-black
          hover:shadow-[inset_0_0_22px_rgba(230,201,114,0.9),_0_0_36px_rgba(230,201,114,1)]

          disabled:opacity-70
          disabled:cursor-not-allowed
          transition-all duration-200
        "
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
        className="text-[10px] opacity-30 mt-8 hover:opacity-60 transition"
      >
        admin
      </button>

      <div id="recaptcha-container"></div>
    </div>
  );
}
