"use client";

import { useState } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  linkWithCredential,
  PhoneAuthProvider,
} from "firebase/auth";
import { auth } from "@/firebase/config";
import toast from "react-hot-toast";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: any;
  }
}

export default function VerifyPhonePage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleVerify = async () => {
    if (!phone || phone.length !== 10) {
      toast.error("Enter valid number");
      return;
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
        toast.success("OTP Sent 📩");
        return;
      }

      const credential = PhoneAuthProvider.credential(
        window.confirmationResult.verificationId,
        otp
      );

      if (auth.currentUser) {
        await linkWithCredential(auth.currentUser, credential);
      }

      toast.success("Phone Linked Successfully 🔗");
      window.location.href = "/payment";
    } catch (error) {
      toast.error("Verification Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <h2 className="text-2xl mb-6 text-[#E6C972] font-bold">
        Verify Phone Before Payment
      </h2>

      <input
        type="tel"
        placeholder="Enter Mobile Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-64 p-3 rounded-xl bg-black border-2 border-[#E6C972] text-[#E6C972]"
      />

      {otpSent && (
        <input
          type="number"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-64 p-3 rounded-xl bg-black border-2 border-[#E6C972] text-[#E6C972] mt-4"
        />
      )}

      <button
        onClick={handleVerify}
        disabled={loading}
        className="mt-6 px-6 py-3 bg-black border border-[#E6C972] text-[#E6C972] rounded-xl"
      >
        {otpSent ? "Verify OTP" : "Send OTP"}
      </button>

      <div id="recaptcha-container"></div>
    </div>
  );
}