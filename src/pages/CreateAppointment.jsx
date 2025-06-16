import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function CreateAppointment() {
  const [serviceType, setServiceType] = useState("");
  const [mechanicId, setMechanicId] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.warn("❌ No user logged in. Redirecting...");
      navigate("/login");
    } else {
      console.log("👤 Logged in as:", user.uid);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

    if (!mechanicId || !serviceType || !date) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      console.log("📤 Submitting appointment for:", user.uid);
      const docRef = await addDoc(collection(db, "appointments"), {
        customerId: user.uid,
        mechanicId,
        serviceType,
        notes,
        status: "scheduled",
        date: Timestamp.fromDate(new Date(date)),
        createdAt: Timestamp.now(),
      });
      console.log("✅ Appointment created with ID:", docRef.id);
      alert("✅ Appointment scheduled!");
      navigate("/customer");
    } catch (err) {
      console.error("🔥 Firestore write failed:", err);
      alert("❌ Could not create appointment.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
      <h2>📅 Schedule Maintenance Appointment</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Service type (e.g. Oil Change)"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Mechanic UID"
          value={mechanicId}
          onChange={(e) => setMechanicId(e.target.value)}
          required
          style={inputStyle}
        />

        <label style={labelStyle}>Select Date & Time:</label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={inputStyle}
        />

        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ ...inputStyle, height: "80px" }}
        />

        <button type="submit" style={buttonStyle}>Submit</button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  fontSize: "16px",
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: "bold",
  display: "block",
  marginBottom: "6px",
  marginTop: "10px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  fontSize: "16px",
  backgroundColor: "#4caf50",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
