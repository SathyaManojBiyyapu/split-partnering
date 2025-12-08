import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "splitpartnering.firebaseapp.com",
  projectId: "splitpartnering",
  storageBucket: "splitpartnering.appspot.com",
  messagingSenderId: "656417651216",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log("API KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log("APP ID:", process.env.NEXT_PUBLIC_FIREBASE_APP_ID);

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
