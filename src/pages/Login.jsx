import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const provider = new GoogleAuthProvider();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      await routeUser(userCred.user.uid);
    } catch (err) {
      setError("❌ " + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const uid = result.user.uid;
      const email = result.user.email;

      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // First-time Google user — default to "user"
        await setDoc(userDocRef, {
          email,
          role: "user",
          createdAt: new Date(),
        });
      }

      await routeUser(uid);
    } catch (err) {
      setError("❌ " + err.message);
    }
  };

  const routeUser = async (uid) => {
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);
    const role = userDocSnap.exists() ? userDocSnap.data().role : "user";

    if (role === "mechanic") {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/customer";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        {/* Brand and Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-1">Bussreck Beta</h1>
          <p className="text-sm text-gray-500">Vehicle diagnostics & dispatch made simple.</p>
          <p className="text-xs text-red-500 mt-1 italic">⚠️ Private beta. Access by invite only.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>

        {/* OR Divider */}
        <div className="text-center my-4 text-gray-400 text-sm">or</div>

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100 transition"
        >
          🔐 Sign in with Google
        </button>

        {/* Error */}
        {error && (
          <p className="text-red-500 mt-4 text-sm text-center">{error}</p>
        )}

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
        <p className="text-xs text-center text-gray-400 mt-2">
          &copy; 2025 Bussreck, Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
}
