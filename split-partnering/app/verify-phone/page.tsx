"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  linkWithCredential,
} from "firebase/auth";

import { auth } from "@/firebase/config";
import toast from "react-hot-toast";

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

export default function VerifyPhonePage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

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
     SEND OTP
  ------------------------------------------ */
  const sendOtp = async () => {
    if (!phone || phone.length !== 10) {
      toast.error("Enter valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);
      const verifier = setupRecaptcha();

      const confirmation = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        verifier
      );

      window.confirmationResult = confirmation;
      setOtpSent(true);
      toast.success("OTP sent to your mobile 📩");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------
     VERIFY OTP & LINK WITH GOOGLE
  ------------------------------------------ */
  const verifyOtpAndLink = async () => {
    if (!otp) {
      toast.error("Enter OTP");
      return;
    }

    try {
      setLoading(true);

      const confirmation = window.confirmationResult;
      const result = await confirmation.confirm(otp);

      const phoneCredential = PhoneAuthProvider.credential(
        confirmation.verificationId,
        otp
      );

      const user = auth.currentUser;

      if (!user) {
        toast.error("No logged-in user found");
        return;
      }

      await linkWithCredential(user, phoneCredential);

      toast.success("Phone number linked successfully ✅");

      localStorage.setItem("phone", phone);
      router.push("/profile");
    } catch (err) {
      console.error(err);
      toast.error("OTP verification failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 flex flex-col items-center text-white">
      <h1 className="text-3xl font-bold mb-4">Verify Phone Number</h1>
      <p className="text-sm text-gray-400 mb-8">
        One-time verification to secure your account
      </p>

      {/* PHONE INPUT */}
      <input
        type="tel"
        placeholder="Enter Mobile Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        disabled={otpSent}
        className="input phone-input w-72"
      />

      {/* OTP INPUT */}
      {otpSent && (
        <input
          type="number"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="input otp-input w-72 mt-4"
        />
      )}

      {/* ACTION BUTTON */}
      <button
        onClick={otpSent ? verifyOtpAndLink : sendOtp}
        disabled={loading}
        className="btn-primary mt-6 w-72"
      >
        {loading
          ? "Please wait..."
          : otpSent
          ? "Verify & Continue"
          : "Send OTP"}
      </button>

      <div id="recaptcha-container"></div>
    </div>
  );
}
