"use client";

import { useState } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../firebase/config"; // <- changed

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);

  const sendOTP = async () => {
    if (!phone) return alert("Enter mobile number");
    try {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
      const result = await signInWithPhoneNumber(auth, "+91" + phone, recaptcha);
      setConfirmation(result);
      alert("OTP sent!");
    } catch (error) {
      console.error(error);
      alert("Error sending OTP. Try again.");
    }
  };

  const verifyOTP = async () => {
    if (!confirmation) return alert("No OTP request found");
    try {
      await confirmation.confirm(otp);
      alert("Login Successful!");
      window.location.href = "/categories";
    } catch (err) {
      console.error(err);
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

      <br /><br />

      <button onClick={sendOTP} style={{ padding: "10px 20px", background: "lime", borderRadius: 5 }}>
        Send OTP
      </button>

      <br /><br />

      <input
        type="number"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        style={{ padding: 10, width: 250 }}
      />

      <br /><br />

      <button onClick={verifyOTP} style={{ padding: "10px 20px", background: "cyan", borderRadius: 5 }}>
        Verify OTP
      </button>

      <div id="recaptcha-container"></div>
    </div>
  );
}
