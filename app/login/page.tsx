"use client";

import { useState, useEffect } from "react";
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
  const [showOTP, setShowOTP] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  /* ------------------------------------------
     LOAD SAVED USER
  ------------------------------------------ */
  useEffect(() => {
    const saved = localStorage.getItem("phone");
    if (saved) setLoggedInUser(saved);
  }, []);

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
     START LOGIN
  ------------------------------------------ */
  const startLogin = () => {
    if (!phone || phone.length !== 10)
      return alert("Enter valid 10-digit mobile number.");

    setShowOTP(true);
  };

  /* ------------------------------------------
     SEND OTP (+91 REQUIRED BY FIREBASE)
  ------------------------------------------ */
  const sendOTP = async () => {
    if (!phone) return alert("Enter phone number");

    setLoading(true);

    try {
      const verifier = setupRecaptcha();

      const confirmation = await signInWithPhoneNumber(
        auth,
        "+91" + phone, // ONLY THIS IS WITH +91
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

  /* ------------------------------------------
     VERIFY OTP
  ------------------------------------------ */
  const verifyOTP = async () => {
    if (!otp) return alert("Enter OTP");

    try {
      await window.confirmationResult.confirm(otp);

      // ALWAYS STORE CLEAN NUMBER (NO +91)
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("phone", phone.trim());

      alert("Login Successful!");
      window.location.href = "/profile";
    } catch (error) {
      alert("Invalid OTP.");
    }
  };

  /* ------------------------------------------
     GUEST LOGIN
  ------------------------------------------ */
  const guestLogin = () => {
    localStorage.setItem("guest", "true");
    window.location.href = "/";
  };

  /* ------------------------------------------
     LOGOUT
  ------------------------------------------ */
  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  /* ------------------------------------------
     UI
  ------------------------------------------ */
  return (
    <div className="min-h-screen pt-24 flex flex-col items-center text-white">

      <h1 className="text-3xl font-bold text-[#16FF6E] mb-6">
        Login / Signup
      </h1>

      {loggedInUser && (
        <div className="bg-[#222] p-4 rounded-lg mb-4 text-center w-64">
          <p className="text-sm">Logged in as:</p>
          <p className="font-bold">{loggedInUser}</p>
        </div>
      )}

      <input
        type="tel"
        placeholder="Enter Mobile Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="neon-input w-64"
      />

      <button
        onClick={startLogin}
        className="bg-[#16FF6E] text-black font-bold px-6 py-2 rounded mt-3"
      >
        Login with OTP
      </button>

      <button
        onClick={guestLogin}
        className="bg-blue-400 text-black font-bold px-6 py-2 rounded mt-3"
      >
        Continue as Guest
      </button>

      {showOTP && (
        <>
          <button
            onClick={sendOTP}
            className="bg-white text-black px-6 py-2 rounded font-bold mt-3"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>

          <input
            type="number"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="neon-input w-64 mt-4"
          />

          <button
            onClick={verifyOTP}
            className="bg-cyan-400 text-black px-6 py-2 rounded font-bold mt-3"
          >
            Verify OTP
          </button>
        </>
      )}

      <button
        onClick={logout}
        className="text-red-400 mt-6 underline text-sm"
      >
        Logout
      </button>

      <button
        onClick={() => (window.location.href = "/admin")}
        className="text-[10px] opacity-30 mt-2"
      >
        admin
      </button>

      <div id="recaptcha-container"></div>
    </div>
  );
}
