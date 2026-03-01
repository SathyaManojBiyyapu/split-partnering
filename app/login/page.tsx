"use client";

import { useState } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  linkWithCredential,
  PhoneAuthProvider,
  UserInfo,
} from "firebase/auth";

import { auth, googleProvider, db } from "@/firebase/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: any;
  }
}

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  /* -----------------------------
     CREATE / UPDATE USER PROFILE
  ----------------------------- */
  const createUserProfile = async (user: any) => {
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          name: user.displayName || localStorage.getItem("name") || "",
          email: user.email || "",
          phone: user.phoneNumber || localStorage.getItem("phone") || "",
          town: localStorage.getItem("town") || "",
          state: localStorage.getItem("state") || "",
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error("User profile creation error:", err);
    }
  };

  /* -----------------------------
     SETUP RECAPTCHA
  ----------------------------- */
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

  /* -----------------------------
     OTP LOGIN
  ----------------------------- */
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
        toast.success("OTP sent 📩");
        return;
      }

      if (!otp) {
        toast.error("Enter OTP");
        return;
      }

      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;

      /* LINK GOOGLE + PHONE IF NEEDED */
      if (isGoogleUser && auth.currentUser) {
        const credential = PhoneAuthProvider.credential(
          window.confirmationResult.verificationId,
          otp
        );
        await linkWithCredential(auth.currentUser, credential);
        toast.success("Google & Phone Linked 🔗");
      }

      /* CREATE USER PROFILE */
      await createUserProfile(user);

      const providers = user.providerData.map(
        (p: UserInfo) => p.providerId
      );

      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("uid", user.uid);
      localStorage.setItem("phone", phone.trim());
      localStorage.setItem("providers", JSON.stringify(providers));

      toast.success("Login successful 🎉");
      window.location.href = "/profile";
    } catch (error) {
      console.error(error);
      toast.error("OTP verification failed ❌");
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
     GOOGLE LOGIN
  ----------------------------- */
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      setIsGoogleUser(true);

      /* CREATE USER PROFILE */
      await createUserProfile(user);

      const providers = user.providerData.map(
        (p: UserInfo) => p.providerId
      );

      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("uid", user.uid);
      localStorage.setItem("email", user.email || "");
      localStorage.setItem("name", user.displayName || "");
      localStorage.setItem("providers", JSON.stringify(providers));

      toast.success("Google login successful 🎉");
      window.location.href = "/profile";
    } catch (error) {
      console.error(error);
      toast.error("Google login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 flex flex-col items-center text-white">
      <h1 className="text-3xl font-bold text-[#E6C972] mb-8">
        Login / Signup
      </h1>

      <input
        type="tel"
        placeholder="Enter Mobile Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        disabled={otpSent}
        className="
          w-64 p-3 rounded-xl
          bg-black border-2 border-[#E6C972]
          text-[#E6C972]
          shadow-[0_0_20px_rgba(230,201,114,0.8)]
          focus:shadow-[0_0_40px_rgba(230,201,114,1)]
          outline-none transition
        "
      />

      {otpSent && (
        <input
          type="number"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="
            w-64 p-3 rounded-xl mt-4
            bg-black border-2 border-[#E6C972]
            text-[#E6C972]
            shadow-[0_0_20px_rgba(230,201,114,0.8)]
            focus:shadow-[0_0_40px_rgba(230,201,114,1)]
            outline-none transition
          "
        />
      )}

      <button
        onClick={handleLoginWithOTP}
        disabled={loading}
        className="
          mt-6 px-8 py-3 rounded-xl font-bold
          bg-black
          text-[#E6C972]
          border border-[#E6C972]
          shadow-[0_0_18px_rgba(230,201,114,0.75)]
          hover:bg-[#F3DC8A]
          hover:text-black
          hover:shadow-[0_0_36px_rgba(230,201,114,1)]
          transition-all duration-200
        "
      >
        {loading
          ? "Please wait..."
          : otpSent
          ? "Verify OTP"
          : "Login with OTP"}
      </button>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="
          mt-4 px-8 py-3 rounded-xl font-semibold
          border border-gray-500
          hover:bg-white/10
          transition
        "
      >
        Continue with Google
      </button>

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