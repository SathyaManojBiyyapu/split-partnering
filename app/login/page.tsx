"use client";
import { useEffect, useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/firebase";

export default function LoginPage() {
  const [phone, setPhone] = useState("");

  // ⭐ Initialize Recaptcha ONCE
  useEffect(() => {
    if (typeof window !== "undefined" && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
    }
  }, []);

  // ⭐ Send OTP
  const sendOTP = async () => {
    try {
      const appVerifier = window.recaptchaVerifier;

      const confirmation = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        appVerifier
      );

      window.confirmationResult = confirmation;

      alert("OTP sent!");
    } catch (error: any) {
      console.error("OTP Error:", error?.code, error?.message);

      // FIX reCAPTCHA already rendered error
      if (error?.message?.includes("reCAPTCHA has already been rendered")) {
        alert("Refreshing Recaptcha...");
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
        location.reload();
      }
    }
  };

  return (
    <div className="p-6">
      <input
        type="tel"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="p-2 rounded text-black"
      />

      <button
        onClick={sendOTP}
        className="p-2 bg-green-500 rounded text-white ml-2"
      >
        Send OTP
      </button>

      {/* Invisible Recaptcha */}
      <div id="recaptcha-container"></div>
    </div>
  );
}
