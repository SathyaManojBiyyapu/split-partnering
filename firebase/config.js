import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBx11nyHmS-xw1jyeDEX_Qxsd4cGhJqk18",
  authDomain: "splitpartnering.firebaseapp.com",
  projectId: "splitpartnering",
  storageBucket: "splitpartnering.firebasestorage.app",
  messagingSenderId: "656417651216",
  appId: "1:656417651216:web:cd20cd09120190171ea895",
  measurementId: "G-Z9LQZ49T2B",
};

const app = initializeApp(firebaseConfig);

/* AUTH */
export const auth = getAuth(app);

/* FIRESTORE */
export const db = getFirestore(app);

/* GOOGLE PROVIDER */
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

export const googleProvider = provider;