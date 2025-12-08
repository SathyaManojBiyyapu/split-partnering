"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase/config";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");

  // ⭐ Correct Firebase v10 Recaptcha Setup
  const setupRecaptcha = async () => {
    if (typeof window === "undefined") return;

    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }

    await window.recaptchaVerifier.render(); // REQUIRED
  };

  // ⭐ Send OTP
  const sendOTP = async () => {
    if (phone.length < 10) {
      alert("Enter a valid number");
      return;
    }

    try {
      await setupRecaptcha();
      const fullPhone = "+91" + phone;

      const confirmation = await signInWithPhoneNumber(
        auth,
        fullPhone,
        window.recaptchaVerifier
      );

      window.confirmationResult = confirmation;
      setStep("otp");
      alert("OTP Sent!");
    } catch (err: any) {
      console.error("OTP Error:", err);
      alert("Failed: " + err.message);
    }
  };

  // ⭐ Verify OTP
  const verifyOTP = async () => {
    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;

      await setDoc(
        doc(db, "users", user.phoneNumber),
        {
          phone: user.phoneNumber,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      alert("Login Successful!");
      router.push("/profile");
    } catch (err: any) {
      alert("Invalid OTP");
      console.error(err);
    }
  };

  return (
    <div className="pt-32 px-6 text-white max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Login</h1>

      {step === "phone" && (
        <>
          <input
            placeholder="Enter phone number"
            className="p-3 w-full rounded bg-white text-black"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button
            onClick={sendOTP}
            className="mt-4 px-6 py-3 bg-[#16FF6E] text-black rounded font-bold"
          >
            Send OTP
          </button>
        </>
      )}

      {step === "otp" && (
        <>
          <input
            placeholder="Enter OTP"
            className="p-3 w-full rounded bg-white text-black"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            onClick={verifyOTP}
            className="mt-4 px-6 py-3 bg-[#16FF6E] text-black rounded font-bold"
          >
            Verify OTP
          </button>
        </>
      )}

      <div id="recaptcha-container"></div>
    </div>
  );
}
