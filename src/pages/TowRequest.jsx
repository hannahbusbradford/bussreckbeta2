import React, { useState } from "react";
import { db, auth } from "../firebase"; // ✅ import auth
import { collection, addDoc } from "firebase/firestore";

export default function TowRequest() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [issue, setIssue] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !issue.trim()) {
      setStatus("❌ All fields are required.");
      return;
    }

    if (!navigator.geolocation) {
      setStatus("❌ Geolocation not supported.");
      return;
    }

    const user = auth.currentUser; // ✅ Get current user
    if (!user) {
      setStatus("❌ You must be logged in.");
      return;
    }

    setStatus("📡 Getting your location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await addDoc(collection(db, "towRequests"), {
            uid: user.uid, // ✅ This is the key fix
            name: name.trim(),
            phone: phone.trim(),
            issue: issue.trim(),
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            status: "pending",
            assignedMechanic: null,
            timestamp: new Date(),
          });

          setStatus("✅ Tow request submitted with your location!");
          setName("");
          setPhone("");
          setIssue("");
        } catch (err) {
          console.error("Firestore error:", err);
          setStatus("❌ Failed to submit. Try again.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setStatus("❌ Could not get your location.");
      }
    );
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Request Tow Assistance</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <textarea
          placeholder="What’s wrong with the car?"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", height: "80px" }}
        />
        <button type="submit" style={{ padding: "10px 20px", marginTop: "15px" }}>
          Submit Request
        </button>
      </form>
      {status && <p style={{ marginTop: "20px" }}>{status}</p>}
    </div>
  );
}
