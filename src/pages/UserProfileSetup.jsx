import React, { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function UserProfileSetup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user"); // default role
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      setStatus("❌ Must be signed in.");
      return;
    }

    try {
      await setDoc(doc(db, "users", user.uid), {
        name: name.trim(),
        phone: phone.trim(),
        role,
        email: user.email,
        createdAt: new Date(),
      });

      // ✅ Updated role-based redirect
      if (role === "mechanic") {
        navigate("/dashboard");
      } else {
        navigate("/customer");
      }
    } catch (error) {
      console.error("Profile setup failed:", error);
      setStatus("❌ Error saving profile.");
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          style={inputStyle}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
          <option value="user">User</option>
          <option value="mechanic">Mechanic</option>
        </select>
        <button type="submit" style={{ padding: "10px 20px", marginTop: "10px" }}>Save Profile</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
};
