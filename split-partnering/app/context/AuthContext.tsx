"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/firebase/config";
import { User, onAuthStateChanged } from "firebase/auth";

/* =========================
   TYPES
========================= */
type AuthContextType = {
  user: User | null;
  loading: boolean;

  /* ➕ NEW */
  provider: "google" | "phone" | "password" | null;
  phoneLinked: boolean;
  needsPhoneVerification: boolean;
};

/* =========================
   CONTEXT
========================= */
const AuthContext = createContext<AuthContextType | null>(null);

/* =========================
   PROVIDER
========================= */
export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* ➕ NEW STATE */
  const [provider, setProvider] = useState<
    "google" | "phone" | "password" | null
  >(null);

  const [phoneLinked, setPhoneLinked] = useState(false);
  const [needsPhoneVerification, setNeedsPhoneVerification] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        /* =========================
           PROVIDER DETECTION
        ========================= */
        const providerId = currentUser.providerData[0]?.providerId;

        if (providerId === "google.com") {
          setProvider("google");
        } else if (providerId === "phone") {
          setProvider("phone");
        } else if (providerId === "password") {
          setProvider("password");
        } else {
          setProvider(null);
        }

        /* =========================
           PHONE LINK CHECK
        ========================= */
        const hasPhone = !!currentUser.phoneNumber;
        setPhoneLinked(hasPhone);

        /**
         * RULE:
         * - Google login WITHOUT phone → needs OTP verification
         * - Phone login → always verified
         */
        if (providerId === "google.com" && !hasPhone) {
          setNeedsPhoneVerification(true);
        } else {
          setNeedsPhoneVerification(false);
        }
      } else {
        setProvider(null);
        setPhoneLinked(false);
        setNeedsPhoneVerification(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        provider,
        phoneLinked,
        needsPhoneVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =========================
   HOOK
========================= */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
