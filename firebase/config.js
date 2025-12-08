// firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase credentials
const firebaseConfig = {
  apiKey: "AIzaSyBx11nyHmS-xw1jyeDEX_Qxsd4cGhJqk18",
  authDomain: "splitpartnering.firebaseapp.com",
  projectId: "splitpartnering",
  storageBucket: "splitpartnering.appspot.com",   // ✅ FIXED
  messagingSenderId: "656417651216",
  appId: "1:656417651216:web:cd20cd09120190171ea895",
  measurementId: "G-Z9LQZ49T2B",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Export Auth + Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);
