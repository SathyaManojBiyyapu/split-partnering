"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
} from "firebase/auth";

import { auth, googleProvider } from "@/firebase/config";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { provider, needsPhoneVerification } = useAuth();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  /* ------------------------------------------
     GOOGLE USER WITHOUT PHONE → SHOW MESSAGE
  ------------------------------------------ */
  useEffect(() => {
    if (provider === "google" && needsPhoneVerification) {
      toast("Please verify your phone number to continue 📱");
    }
  }, [provider, needsPhoneVerification]);

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
     LOGIN WITH OTP
  ------------------------------------------ */
  const handleLoginWithOTP = async () => {
    if (!phone || phone.length !== 10) {
      toast.error("Enter valid 10-digit mobile number");
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
        toast.success("OTP sent to your mobile 📩");
        return;
      }

      if (!otp) {
        toast.error("Enter OTP");
        return;
      }

      await window.confirmationResult.confirm(otp);

      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("phone", phone);
      localStorage.removeItem("guest");

      toast.success("Login successful 🎉");
      router.push("/profile");
    } catch (err) {
      console.error(err);
      toast.error("OTP verification failed ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------
     LOGIN WITH GOOGLE (FIXED FLOW)
  ------------------------------------------ */
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("uid", user.uid);
      localStorage.setItem("email", user.email || "");
      localStorage.setItem("name", user.displayName || "");
      localStorage.removeItem("guest");

      toast.success("Google login successful 🎉");

      // If phone not linked → stay here & ask OTP
      if (!user.phoneNumber) {
        toast("Verify phone number to unlock all features 📱");
        router.push("/verify-phone"); // ✅ ADD THIS
      } else {
        router.push("/profile");
      }
      
    } catch (err) {
      console.error(err);
      toast.error("Google login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 flex flex-col items-center text-white">
      <h1 className="text-3xl font-bold mb-8">Login / Signup</h1>

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

      {/* OTP BUTTON */}
      <button
        onClick={handleLoginWithOTP}
        disabled={loading}
        className="btn-primary mt-6 w-72"
      >
        {loading
          ? "Please wait..."
          : otpSent
          ? "Verify OTP"
          : "Login with OTP"}
      </button>

      {/* GOOGLE LOGIN */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="btn-outline mt-4 w-72"
      >
        Continue with Google
      </button>

      {/* ADMIN SHORTCUT */}
      <button
        onClick={() => router.push("/admin")}
        className="text-[10px] opacity-30 mt-8 hover:opacity-60 transition"
      >
        admin
      </button>

      {/* RECAPTCHA */}
      <div id="recaptcha-container"></div>
    </div>
  );
}
