"use client";

import { useState } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "@/firebase/config";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  const sendOTP = async () => {
    try {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
      const result = await signInWithPhoneNumber(auth, "+91" + phone, recaptcha);
      setConfirmation(result);
      alert("OTP sent!");
    } catch {
      alert("Error sending OTP");
    }
  };

  const verifyOTP = async () => {
    try {
      await confirmation.confirm(otp);
      alert("Login Successful!");
      window.location.href = "/categories";
    } catch {
      alert("Invalid OTP");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1 style={{ color: "white" }}>Login with OTP</h1>

      <input
        type="number"
        placeholder="Enter mobile number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ padding: 10, width: 250 }}
      />

      <button onClick={sendOTP} style={{ padding: 10, marginTop: 10 }}>
        Send OTP
      </button>

      <input
        type="number"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        style={{ padding: 10, width: 250, marginTop: 20 }}
      />

      <button onClick={verifyOTP} style={{ padding: 10, marginTop: 10 }}>
        Verify OTP
      </button>

      <div id="recaptcha-container"></div>
    </div>
  );
}
