import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDN6lX1EP0E1m4OW1taHTOJul8lBhQrObA", // 🔑 this key is from skeetskeet-78577
  authDomain: "skeetskeet-78577.firebaseapp.com", // ✅ fix this
  projectId: "skeetskeet-78577",                  // ✅ fix this
  storageBucket: "skeetskeet-78577.appspot.com",  // ✅ fix this
  messagingSenderId: "606298867122",              // ✅ fix this
  appId: "1:606298867122:web:4b3b3eca275f2956fe90ab" // ✅ fix this
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
