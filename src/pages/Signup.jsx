import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Link } from "react-router-dom";

const provider = new GoogleAuthProvider();

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCred.user.uid), {
        email,
        role,
      });
      window.location.href = role === "mechanic" ? "/dashboard" : "/customer";
    } catch (err) {
      setError("❌ " + err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "customer",
      });

      window.location.href = "/customer";
    } catch (err) {
      setError("❌ Google sign-in failed: " + err.message);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="bg-white p-5 rounded shadow-lg w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Create Your Account</h2>

        <form onSubmit={handleSignup} className="mb-3">
          <select
            className="form-select mb-3"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="customer">Customer</option>
            <option value="mechanic">Mechanic</option>
          </select>

          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
        </form>

        <div className="text-center mb-3">or</div>

        <button
          onClick={handleGoogleSignup}
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            style={{ width: "20px", height: "20px" }}
          />
          Sign in with Google
        </button>

        {error && (
          <p className="text-danger text-center mt-3" style={{ fontSize: "0.9rem" }}>
            {error}
          </p>
        )}

        <p className="mt-4 text-center text-muted" style={{ fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <Link to="/login" className="text-primary">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
